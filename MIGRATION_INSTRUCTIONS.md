# Database Migration Instructions

## Automatic Migration Not Available

The Supabase REST API doesn't support direct SQL execution via `exec_sql` RPC function. You'll need to apply the migration manually using the Supabase Dashboard.

## Option 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/ispqajqvdrjxdpbnmjht/sql/new)
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the following SQL:

```sql
-- Add columns for crypto payment tracking
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_token TEXT;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_token_amount DECIMAL(20, 8);
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS payment_exchange_rate DECIMAL(20, 8);
```

5. Click "Run" or press `Cmd+Enter`
6. You should see "Success. No rows returned" message

## Option 2: Supabase CLI (If you have it configured)

```bash
supabase db push
```

## Verification

After running the migration, you can verify the columns were added by running this query in the SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'expenses' 
  AND column_name IN ('payment_token', 'payment_token_amount', 'payment_exchange_rate');
```

You should see 3 rows returned showing the new columns.

## What These Columns Do

- **payment_token**: Stores the token symbol (e.g., "WLD")
- **payment_token_amount**: Stores the amount in crypto tokens (e.g., 5.0000)
- **payment_exchange_rate**: Stores the exchange rate at payment time (e.g., 2.00 USD per WLD)

These columns are only populated for payment-type expenses created via the Settle Up feature.
