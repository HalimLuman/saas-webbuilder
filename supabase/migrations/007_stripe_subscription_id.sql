-- ============================================================
-- Migration 007: Add stripe_subscription_id to users table
-- Run in Supabase Dashboard → SQL Editor → Run
-- ============================================================

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_stripe_sub ON public.users(stripe_subscription_id);
