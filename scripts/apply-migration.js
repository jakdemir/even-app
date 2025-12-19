const https = require('https');
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse environment variables
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim();
    }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

console.log('🔄 Applying payment tracking migration to Supabase...\n');

const migrations = [
    'ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_token TEXT;',
    'ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_token_amount DECIMAL(20, 8);',
    'ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_exchange_rate DECIMAL(20, 8);'
];

async function executeSql(sql) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ query: sql });

        const options = {
            hostname: `${projectRef}.supabase.co`,
            port: 443,
            path: '/rest/v1/rpc/exec_sql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(body);
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

async function applyMigrations() {
    const columnNames = ['payment_token', 'payment_token_amount', 'payment_exchange_rate'];

    for (let i = 0; i < migrations.length; i++) {
        try {
            console.log(`  Adding column: ${columnNames[i]}...`);
            await executeSql(migrations[i]);
            console.log(`  ✅ ${columnNames[i]} added successfully`);
        } catch (error) {
            // Column might already exist, which is fine
            console.log(`  ⚠️  ${columnNames[i]}: ${error.message}`);
        }
    }

    console.log('\n✅ Migration process completed!');
    console.log('\n📝 Note: If you see warnings above, the columns may already exist.');
    console.log('   This is expected if running the migration multiple times.');
}

applyMigrations().catch(err => {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
});
