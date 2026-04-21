-- ============================================================
-- BuildStack — Migration 003: Live CRUD Backend
-- Run in Supabase → SQL Editor → Run
-- ============================================================

-- ── 1. Add api_key to sites ──────────────────────────────────────────────────
-- Each site gets a secret key used by published pages to authenticate CRUD calls.

ALTER TABLE public.sites
  ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE DEFAULT ('sk_live_' || replace(gen_random_uuid()::text, '-', ''));

-- Back-fill existing sites that have no key yet
UPDATE public.sites
  SET api_key = 'sk_live_' || replace(gen_random_uuid()::text, '-', '')
  WHERE api_key IS NULL;

ALTER TABLE public.sites ALTER COLUMN api_key SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_sites_api_key ON public.sites (api_key);

-- ── 2. Improve cms_items for use as a live CRUD data store ───────────────────

ALTER TABLE public.cms_items
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Trigger to keep updated_at fresh on every UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cms_items_updated_at ON public.cms_items;
CREATE TRIGGER cms_items_updated_at
  BEFORE UPDATE ON public.cms_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 3. RLS for cms_items ─────────────────────────────────────────────────────
-- Allow anyone who knows the collection_id to read published items (public data).
-- Only the owner (identified by session OR verified via api_key server-side) can mutate.
-- Mutations are handled exclusively through the API routes (service-role client),
-- so we just need read-level RLS here.

ALTER TABLE public.cms_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cms_items_select ON public.cms_items;
CREATE POLICY cms_items_select ON public.cms_items
  FOR SELECT USING (true);   -- public read; the API route enforces ownership

DROP POLICY IF EXISTS cms_items_insert ON public.cms_items;
CREATE POLICY cms_items_insert ON public.cms_items
  FOR INSERT WITH CHECK (true);  -- API route validates api_key / session before inserting

DROP POLICY IF EXISTS cms_items_update ON public.cms_items;
CREATE POLICY cms_items_update ON public.cms_items
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS cms_items_delete ON public.cms_items;
CREATE POLICY cms_items_delete ON public.cms_items
  FOR DELETE USING (true);

-- ── 4. RLS for cms_collections ───────────────────────────────────────────────

ALTER TABLE public.cms_collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cms_collections_select ON public.cms_collections;
CREATE POLICY cms_collections_select ON public.cms_collections
  FOR SELECT USING (true);

DROP POLICY IF EXISTS cms_collections_insert ON public.cms_collections;
CREATE POLICY cms_collections_insert ON public.cms_collections
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS cms_collections_update ON public.cms_collections;
CREATE POLICY cms_collections_update ON public.cms_collections
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS cms_collections_delete ON public.cms_collections;
CREATE POLICY cms_collections_delete ON public.cms_collections
  FOR DELETE USING (true);

-- ── 5. Index for fast slug + site lookups ────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_cms_collections_site_slug
  ON public.cms_collections (site_id, slug);

CREATE INDEX IF NOT EXISTS idx_cms_items_collection_status
  ON public.cms_items (collection_id, status);
