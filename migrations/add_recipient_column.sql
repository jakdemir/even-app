-- Add recipient column to expenses table for payment tracking
-- Run this in your Supabase SQL Editor

ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS recipient text;
