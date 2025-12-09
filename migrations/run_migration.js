const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('📝 Running migration: Add recipient column to expenses table');
    console.log('');

    try {
        // Execute the migration
        const { data, error } = await supabase.rpc('exec_sql', {
            sql: 'ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS recipient text;'
        });

        if (error) {
            // If RPC doesn't exist, try direct query (this won't work with anon key, but let's try)
            console.log('⚠️  RPC method not available. Please run this SQL manually in Supabase SQL Editor:');
            console.log('');
            console.log('ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS recipient text;');
            console.log('');
            console.log('Then restart your dev server.');
        } else {
            console.log('✅ Migration completed successfully!');
            console.log('');
            console.log('The recipient column has been added to the expenses table.');
            console.log('You can now record payments without errors.');
        }
    } catch (err) {
        console.error('❌ Error running migration:', err.message);
        console.log('');
        console.log('Please run this SQL manually in your Supabase SQL Editor:');
        console.log('');
        console.log('ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS recipient text;');
    }
}

runMigration();
