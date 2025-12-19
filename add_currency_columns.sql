-- Add separate currency amount columns to expenses table
-- This ensures we track USD, USDC, and WLD amounts separately

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS amount_usd DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS amount_usdc DECIMAL(20, 8),
ADD COLUMN IF NOT EXISTS amount_wld DECIMAL(20, 8);

-- Migrate existing data: copy current 'amount' to 'amount_usd'
UPDATE public.expenses 
SET amount_usd = amount 
WHERE amount_usd IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.expenses.amount IS 'Legacy amount field - use amount_usd, amount_usdc, or amount_wld instead';
COMMENT ON COLUMN public.expenses.amount_usd IS 'Amount in USD';
COMMENT ON COLUMN public.expenses.amount_usdc IS 'Amount in USDC (if paid with USDC)';
COMMENT ON COLUMN public.expenses.amount_wld IS 'Amount in WLD (if paid with WLD)';
