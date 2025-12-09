#!/bin/bash

# Script to apply database migration for recipient column
# This adds the recipient column to the expenses table

echo "📝 Database Migration: Add recipient column to expenses table"
echo ""
echo "Please run the following SQL command in your Supabase SQL Editor:"
echo ""
echo "ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS recipient text;"
echo ""
echo "Or use the Supabase CLI:"
echo "supabase db execute --file migrations/add_recipient_column.sql"
echo ""
echo "After running the migration, restart your development server."
