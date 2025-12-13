-- Enable Row Level Security on all tables
-- This SQL script should be run in your Supabase SQL Editor

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on groups table
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Enable RLS on group_members table
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Enable RLS on expenses table
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Note: The RLS policies are already defined, this just enables them
-- After running this script, verify in Supabase dashboard that RLS is enabled
