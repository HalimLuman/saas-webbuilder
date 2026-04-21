-- ============================================================
-- Production Features Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Handles both fresh installs and existing schema.sql databases.
-- ============================================================

-- ─── 1. asset_folders (new — must be created before altering assets) ──────────

CREATE TABLE IF NOT EXISTS public.asset_folders (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  name       text        NOT NULL,
  color      text        DEFAULT 'bg-indigo-500',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_folders_owner ON public.asset_folders(owner_id);

-- ─── 2. Alter public.assets (already exists in schema.sql) ────────────────────

ALTER TABLE public.assets
  ALTER COLUMN site_id DROP NOT NULL,
  ALTER COLUMN url     DROP NOT NULL;

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS owner_id   uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS type       text        CHECK (type IN ('image','video','document','other')),
  ADD COLUMN IF NOT EXISTS folder_id  uuid        REFERENCES public.asset_folders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS starred    boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags       text[]      DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS used_in    text[]      DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_assets_owner    ON public.assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_assets_folder   ON public.assets(folder_id);

-- ─── 3. Alter public.cms_collections (already exists in schema.sql) ───────────

-- Drop the site_id NOT NULL constraint and the unique constraint
ALTER TABLE public.cms_collections
  ALTER COLUMN site_id DROP NOT NULL;

-- Drop old unique constraint if it exists (ignore error if already gone)
DO $$
BEGIN
  ALTER TABLE public.cms_collections DROP CONSTRAINT IF EXISTS cms_collections_site_id_slug_key;
EXCEPTION WHEN OTHERS THEN NULL;
END$$;

ALTER TABLE public.cms_collections
  ADD COLUMN IF NOT EXISTS owner_id    uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS description text        DEFAULT '',
  ADD COLUMN IF NOT EXISTS fields      jsonb       DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS updated_at  timestamptz DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_cms_collections_owner ON public.cms_collections(owner_id);

-- ─── 4. Alter public.cms_items (already exists in schema.sql) ─────────────────
-- Existing table uses `published boolean`; we add a `status text` column

ALTER TABLE public.cms_items
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('published','draft'));

-- Back-fill status from existing published column
UPDATE public.cms_items SET status = CASE WHEN published THEN 'published' ELSE 'draft' END
  WHERE status IS NULL;

ALTER TABLE public.cms_items
  ALTER COLUMN status SET NOT NULL;

-- ─── 5. Forms (new table) ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.forms (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     uuid        REFERENCES public.sites(id) ON DELETE CASCADE,
  owner_id    uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  status      text        NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused')),
  fields      jsonb       DEFAULT '[]',
  settings    jsonb       DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forms_owner  ON public.forms(owner_id);
CREATE INDEX IF NOT EXISTS idx_forms_site   ON public.forms(site_id);

-- ─── 6. Alter public.form_submissions (already exists in schema.sql) ──────────
-- Existing `form_id` is TEXT; add `form_ref` as UUID FK to forms

ALTER TABLE public.form_submissions
  ALTER COLUMN site_id DROP NOT NULL;

ALTER TABLE public.form_submissions
  ADD COLUMN IF NOT EXISTS form_ref uuid REFERENCES public.forms(id) ON DELETE CASCADE;

-- ─── 7. Activity Logs (new table) ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  owner_id     uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  action_type  text        NOT NULL CHECK (action_type IN ('publish','edit','team','billing','deploy_failed','create')),
  description  text        NOT NULL,
  site_id      uuid        REFERENCES public.sites(id) ON DELETE SET NULL,
  metadata     jsonb       DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_owner      ON public.activity_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ─── 8. Team Invites (new table) ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.team_invites (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text        NOT NULL,
  role        text        NOT NULL CHECK (role IN ('admin','designer','editor','viewer')),
  invited_by  uuid        REFERENCES public.users(id) ON DELETE SET NULL,
  owner_id    uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  status      text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired')),
  created_at  timestamptz DEFAULT now(),
  expires_at  timestamptz DEFAULT (now() + interval '7 days')
);

CREATE INDEX IF NOT EXISTS idx_team_invites_owner ON public.team_invites(owner_id);

-- ─── 9. Page Views (new table) ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.page_views (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id       uuid        REFERENCES public.sites(id) ON DELETE CASCADE,
  owner_id      uuid        REFERENCES public.users(id) ON DELETE CASCADE,
  page_path     text        NOT NULL DEFAULT '/',
  referrer      text,
  country_code  char(2),
  device_type   text        CHECK (device_type IN ('desktop','mobile','tablet')),
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_site       ON public.page_views(site_id);
CREATE INDEX IF NOT EXISTS idx_page_views_owner      ON public.page_views(owner_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);

-- ─── 10. Row Level Security for new tables ────────────────────────────────────

ALTER TABLE public.asset_folders  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views      ENABLE ROW LEVEL SECURITY;

-- asset_folders
DROP POLICY IF EXISTS "Users can manage their own folders" ON public.asset_folders;
CREATE POLICY "Users can manage their own folders"
  ON public.asset_folders FOR ALL USING (owner_id = auth.uid());

-- forms
DROP POLICY IF EXISTS "Users can manage their own forms" ON public.forms;
CREATE POLICY "Users can manage their own forms"
  ON public.forms FOR ALL USING (owner_id = auth.uid());

-- form_submissions
DROP POLICY IF EXISTS "Anyone can submit a form" ON public.form_submissions;
CREATE POLICY "Anyone can submit a form"
  ON public.form_submissions FOR INSERT WITH CHECK (true);

-- activity_logs
DROP POLICY IF EXISTS "Users can view their own activity" ON public.activity_logs;
CREATE POLICY "Users can view their own activity"
  ON public.activity_logs FOR SELECT USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Service role can insert activity" ON public.activity_logs;
CREATE POLICY "Service role can insert activity"
  ON public.activity_logs FOR INSERT WITH CHECK (true);

-- team_invites
DROP POLICY IF EXISTS "Users can manage their own invites" ON public.team_invites;
CREATE POLICY "Users can manage their own invites"
  ON public.team_invites FOR ALL USING (owner_id = auth.uid());

-- page_views
DROP POLICY IF EXISTS "Anyone can record a page view" ON public.page_views;
CREATE POLICY "Anyone can record a page view"
  ON public.page_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view their own page views" ON public.page_views;
CREATE POLICY "Users can view their own page views"
  ON public.page_views FOR SELECT USING (owner_id = auth.uid());

-- ─── 11. Storage bucket for assets ───────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  false,
  52428800,  -- 50 MB
  ARRAY['image/*','video/*','application/pdf','application/octet-stream']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (idempotent)
DROP POLICY IF EXISTS "Authenticated users can upload assets"   ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read assets"     ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete assets"   ON storage.objects;

CREATE POLICY "Authenticated users can upload assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Authenticated users can read assets"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can delete assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'assets');
