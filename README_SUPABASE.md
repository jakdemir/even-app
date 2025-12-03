# Supabase Setup

## 1. Create a Supabase Project
Go to [database.new](https://database.new) and create a new project.

## 2. Get Credentials
Copy the `Project URL` and `anon public key` from the API settings.
Create a file named `.env.local` in the root of your project and add:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Run SQL Migrations
Go to the SQL Editor in your Supabase dashboard and run the following SQL to create the tables:

```sql
-- Create a table for users (optional, but good for profiles)
create table if not exists public.users (
  wallet_address text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for expenses
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  description text not null,
  amount numeric not null,
  payer text not null, -- stores the wallet address
  group_id text not null, -- allows multiple groups/rooms
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  type text default 'expense', -- 'expense' or 'payment'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.expenses enable row level security;

-- Create policies (For MVP, we allow public read/write if we don't have full Auth integration yet)
-- WARNING: These policies are insecure and for MVP/Testing only. 
-- In production, you should verify the user via Supabase Auth.

create policy "Enable read access for all users" on public.expenses
  for select using (true);

create policy "Enable insert access for all users" on public.expenses
  for insert with check (true);

create policy "Enable read access for all users" on public.users
  for select using (true);

create policy "Enable insert access for all users" on public.users
  for insert with check (true);
```
