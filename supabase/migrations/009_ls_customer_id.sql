-- Migration 009: Rename billing columns to Lemon Squeezy naming
-- Idempotent — safe to re-run.
-- Run in Supabase Dashboard → SQL Editor → Run

DO $$
BEGIN
  -- paddle_customer_id → ls_customer_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'paddle_customer_id'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN paddle_customer_id TO ls_customer_id;
  END IF;

  -- stripe_customer_id → ls_customer_id (if the rename from Paddle was never applied)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'stripe_customer_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'ls_customer_id'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN stripe_customer_id TO ls_customer_id;
  END IF;
END $$;

-- Drop stale indexes from old naming
DROP INDEX IF EXISTS idx_users_stripe;
DROP INDEX IF EXISTS idx_users_paddle;

-- Create index under the new name
CREATE INDEX IF NOT EXISTS idx_users_ls_customer ON public.users(ls_customer_id);

-- Ensure subscription ID column exists (added in 007, but may not have been run)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_users_stripe_sub ON public.users(stripe_subscription_id);
