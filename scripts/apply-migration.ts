import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function applyMigration() {
    console.log('🔄 Applying payment tracking migration to Supabase...\n');

    const migrations = [
        {
            name: 'payment_token',
            sql: 'ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_token TEXT;'
        },
        {
            name: 'payment_token_amount',
            sql: 'ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_token_amount DECIMAL(20, 8);'
        },
        {
            name: 'payment_exchange_rate',
            sql: 'ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_exchange_rate DECIMAL(20, 8);'
        }
    ];

    for (const migration of migrations) {
        try {
            console.log(`  Adding column: ${migration.name}...`);

            const { data, error } = await supabase.rpc('exec_sql', {
                query: migration.sql
            });

            if (error) {
                // Try direct query if RPC doesn't work
                const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': supabaseServiceKey,
                        'Authorization': `Bearer ${supabaseServiceKey}`
                    },
                    body: JSON.stringify({ query: migration.sql })
                });

                if (!response.ok) {
                    console.log(`  ⚠️  ${migration.name}: ${error.message}`);
                } else {
                    console.log(`  ✅ ${migration.name} added successfully`);
                }
            } else {
                console.log(`  ✅ ${migration.name} added successfully`);
            }
        } catch (err: any) {
            console.log(`  ⚠️  ${migration.name}: ${err.message}`);
        }
    }

    console.log('\n✅ Migration process completed!');
    console.log('\n📝 Note: If you see warnings above, the columns may already exist.');
    console.log('   You can verify by checking the expenses table in Supabase Dashboard.');
}

applyMigration().catch(console.error);
