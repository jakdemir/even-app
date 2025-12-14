# Supabase Row Level Security (RLS) Policies

This document outlines the Row Level Security policies that should be enabled in your Supabase database for the Even app.

## Overview

Row Level Security (RLS) ensures that users can only access and modify data they are authorized to see. This is critical for protecting user privacy and preventing unauthorized access to expense data.

## Required RLS Policies

### 1. Users Table

**Enable RLS:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

**Policies:**

```sql
-- Users can view all users (needed for group member display)
CREATE POLICY "Users can view all users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (wallet_address = auth.uid());

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (wallet_address = auth.uid());
```

### 2. Groups Table

**Enable RLS:**
```sql
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
```

**Policies:**

```sql
-- Users can view groups they are members of
CREATE POLICY "Users can view their groups"
ON groups FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid()
  )
);

-- Users can create groups
CREATE POLICY "Users can create groups"
ON groups FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Group creators can update their groups
CREATE POLICY "Group creators can update groups"
ON groups FOR UPDATE
TO authenticated
USING (created_by = auth.uid());

-- Group creators can delete their groups
CREATE POLICY "Group creators can delete groups"
ON groups FOR DELETE
TO authenticated
USING (created_by = auth.uid());
```

### 3. Group Members Table

**Enable RLS:**
```sql
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
```

**Policies:**

```sql
-- Users can view members of groups they belong to
CREATE POLICY "Users can view group members"
ON group_members FOR SELECT
TO authenticated
USING (
  group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid()
  )
);

-- Users can join groups (insert themselves)
CREATE POLICY "Users can join groups"
ON group_members FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can leave groups (delete themselves)
CREATE POLICY "Users can leave groups"
ON group_members FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

### 4. Expenses Table

**Enable RLS:**
```sql
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
```

**Policies:**

```sql
-- Users can view expenses in their groups
CREATE POLICY "Users can view group expenses"
ON expenses FOR SELECT
TO authenticated
USING (
  group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid()
  )
);

-- Users can create expenses in their groups
CREATE POLICY "Users can create expenses"
ON expenses FOR INSERT
TO authenticated
WITH CHECK (
  group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid()
  )
);

-- Users can update expenses they created
CREATE POLICY "Users can update own expenses"
ON expenses FOR UPDATE
TO authenticated
USING (
  payer = auth.uid() AND
  group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid()
  )
);

-- Users can delete expenses they created
CREATE POLICY "Users can delete own expenses"
ON expenses FOR DELETE
TO authenticated
USING (
  payer = auth.uid() AND
  group_id IN (
    SELECT group_id FROM group_members
    WHERE user_id = auth.uid()
  )
);
```

## How to Apply These Policies

### Option 1: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Database** → **Tables**
3. Select each table (users, groups, group_members, expenses)
4. Click on **RLS** tab
5. Enable RLS for the table
6. Click **New Policy** and paste the SQL for each policy

### Option 2: SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Paste all the SQL commands above
4. Click **Run** to execute

## Verification

To verify RLS is working correctly:

1. **Test with Multiple Accounts:**
   - Create two different user accounts
   - Create a group with User A
   - Try to access the group with User B (should fail)
   - Invite User B to the group
   - Verify User B can now see the group

2. **Test Data Isolation:**
   - User A creates an expense in Group 1
   - User B (not in Group 1) should NOT see this expense
   - User B creates Group 2
   - User A should NOT see Group 2

3. **Check Supabase Logs:**
   - Go to **Logs** → **Database**
   - Look for any RLS policy violations
   - Should see "permission denied" for unauthorized access attempts

## Important Notes

- **Authentication Required:** All policies assume `TO authenticated`, meaning users must be logged in
- **auth.uid():** This function returns the currently authenticated user's ID (wallet address in our case)
- **Cascading Deletes:** Ensure foreign key constraints are set up properly to handle group/expense deletions
- **Performance:** RLS policies can impact query performance. Monitor slow queries and add indexes as needed

## Security Best Practices

1. **Never Disable RLS in Production:** Always keep RLS enabled for all tables
2. **Test Thoroughly:** Test all policies with multiple user accounts before launch
3. **Monitor Access Logs:** Regularly check Supabase logs for suspicious activity
4. **Principle of Least Privilege:** Only grant the minimum permissions necessary
5. **Regular Audits:** Periodically review and update policies as features change

## Contact

If you have questions about RLS setup, contact: **support@even-app.com**
