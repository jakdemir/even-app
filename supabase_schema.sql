-- Create a table for groups
create table if not exists public.groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_by text not null, -- wallet address of creator
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for group members
create table if not exists public.group_members (
  group_id uuid references public.groups(id) on delete cascade,
  user_id text references public.users(wallet_address) on delete cascade,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (group_id, user_id)
);

-- Enable RLS
alter table public.groups enable row level security;
alter table public.group_members enable row level security;

-- Policies (MVP: Public access for simplicity, but ideally should be restricted)
create policy "Enable read access for all users" on public.groups
  for select using (true);

create policy "Enable insert access for all users" on public.groups
  for insert with check (true);

create policy "Enable update access for all users" on public.groups
  for update using (true);

create policy "Enable delete access for all users" on public.groups
  for delete using (true);

create policy "Enable read access for all users" on public.group_members
  for select using (true);

create policy "Enable insert access for all users" on public.group_members
  for insert with check (true);

create policy "Enable delete access for all users" on public.group_members
  for delete using (true);

-- Add new columns to expenses table for advanced features
-- Run these ALTER TABLE commands if the expenses table already exists:

-- For unequal splits
alter table public.expenses add column if not exists split_type text default 'equal';
alter table public.expenses add column if not exists splits jsonb;

-- For currency support
alter table public.expenses add column if not exists currency text default 'USD';

-- For recurring expenses
alter table public.expenses add column if not exists is_recurring boolean default false;
alter table public.expenses add column if not exists recurrence_pattern text; -- 'daily', 'weekly', 'monthly', 'yearly'
alter table public.expenses add column if not exists recurrence_end_date timestamp with time zone;
