-- Fix RLS policies for expenses table
-- This allows all users to read, insert, update, and delete expenses
-- Run this in your Supabase SQL Editor

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON public.expenses;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.expenses;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.expenses;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.expenses;

-- Create new policies for expenses table
CREATE POLICY "Enable read access for all users" ON public.expenses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.expenses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.expenses
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.expenses
  FOR DELETE USING (true);

-- Also add policies for users table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.users;

CREATE POLICY "Enable read access for all users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.users
  FOR UPDATE USING (true);
