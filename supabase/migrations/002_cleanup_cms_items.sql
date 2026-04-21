-- Migration: Normalize cms_items table
-- The cms_items table has both a boolean `published` column and a `status` enum column
-- which are redundant. We sync them and drop the boolean column.
--
-- Run this migration after ensuring all application code uses `status` exclusively.

-- Step 1: Sync existing data — set status based on published boolean where status might be inconsistent
UPDATE public.cms_items
SET status = 'published'
WHERE published = true AND status != 'published';

UPDATE public.cms_items
SET status = 'draft'
WHERE published = false AND status = 'published';

-- Step 2: Drop the redundant boolean column
ALTER TABLE public.cms_items DROP COLUMN IF EXISTS published;

-- Step 3: Ensure all rows have a valid status
UPDATE public.cms_items SET status = 'draft' WHERE status IS NULL;
ALTER TABLE public.cms_items ALTER COLUMN status SET NOT NULL;
