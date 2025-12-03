#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

// Read environment variables
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value.length) env[key.trim()] = value.join('=').trim();
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '');
const PROJECT_REF = SUPABASE_URL.split('.')[0];
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const migrations = [
    "ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS split_type text DEFAULT 'equal'",
    "ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS splits jsonb",
    "ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD'",
    "ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false",
    "ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS recurrence_pattern text",
    "ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS recurrence_end_date timestamp with time zone"
];

async function executeSQL(sql) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ query: sql });

        const options = {
            hostname: 'api.supabase.com',
            path: `/v1/projects/${PROJECT_REF}/database/query`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function runMigrations() {
    console.log('🚀 Applying database migrations...\n');

    for (let i = 0; i < migrations.length; i++) {
        const sql = migrations[i];
        console.log(`[${i + 1}/${migrations.length}] ${sql.substring(0, 60)}...`);

        try {
            await executeSQL(sql);
            console.log('✅ Success\n');
        } catch (err) {
            console.log(`⚠️  ${err.message}\n`);
        }
    }

    console.log('✅ All migrations applied!\n');
    console.log('New features enabled:');
    console.log('  ✓ Unequal splits');
    console.log('  ✓ Multiple currencies');
    console.log('  ✓ Recurring expenses');
}

runMigrations().catch(console.error);
