-- Add columns for crypto payment tracking
-- These columns store details about payments made with cryptocurrency (e.g., WLD)

alter table public.expenses add column if not exists payment_token text;
alter table public.expenses add column if not exists payment_token_amount decimal(20, 8);
alter table public.expenses add column if not exists payment_exchange_rate decimal(20, 8);
