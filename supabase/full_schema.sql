-- ============================================================
-- BuildStack — Complete Database Schema
-- Single file combining schema + all migrations (001–005)
-- Run once in Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── Extensions ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ────────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE plan AS ENUM ('free', 'pro', 'business', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL; END$$;

DO $$ BEGIN
  CREATE TYPE site_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END$$;

DO $$ BEGIN
  CREATE TYPE team_role AS ENUM ('owner', 'admin', 'designer', 'editor', 'viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END$$;

DO $$ BEGIN
  CREATE TYPE deployment_status AS ENUM ('building', 'ready', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END$$;

-- ============================================================
-- TABLES
-- ============================================================

-- ─── public.users ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT UNIQUE NOT NULL,
  name                  TEXT,
  avatar_url            TEXT,
  plan                  plan NOT NULL DEFAULT 'free',
  ai_credits_used       INTEGER NOT NULL DEFAULT 0,
  ai_credits_limit      INTEGER NOT NULL DEFAULT 50,
  stripe_customer_id    TEXT UNIQUE,
  onboarding_completed  BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email  ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe ON public.users(stripe_customer_id);

-- ─── public.teams ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.teams (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  plan                    TEXT NOT NULL DEFAULT 'free',
  stripe_subscription_id  TEXT,
  created_by              UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  owner_id                UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);

-- ─── public.team_members ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.team_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role        team_role NOT NULL DEFAULT 'viewer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);

-- ─── public.team_invites ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.team_invites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin','designer','editor','viewer')),
  invited_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  owner_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','expired')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ DEFAULT (now() + interval '7 days')
);

CREATE INDEX IF NOT EXISTS idx_team_invites_owner ON public.team_invites(owner_id);
CREATE INDEX IF NOT EXISTS idx_team_invites_team  ON public.team_invites(team_id);

-- ─── public.sites ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sites (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_id             UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  status              site_status NOT NULL DEFAULT 'draft',
  domain              TEXT,
  custom_domain       TEXT,
  vercel_project_id   TEXT,
  design_tokens       JSONB NOT NULL DEFAULT '{"primaryColor":"#6366f1","fontFamily":"Inter"}',
  api_key             TEXT UNIQUE DEFAULT ('sk_live_' || replace(gen_random_uuid()::text, '-', '')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sites_owner   ON public.sites(owner_id);
CREATE INDEX IF NOT EXISTS idx_sites_team    ON public.sites(team_id);
CREATE INDEX IF NOT EXISTS idx_sites_status  ON public.sites(status);
CREATE INDEX IF NOT EXISTS idx_sites_api_key ON public.sites(api_key);

-- ─── public.pages ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.pages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL,
  is_homepage BOOLEAN NOT NULL DEFAULT false,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  content     JSONB NOT NULL DEFAULT '{"children":[]}',
  meta        JSONB NOT NULL DEFAULT '{"title":"","description":""}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_pages_site ON public.pages(site_id);

-- ─── public.page_versions ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.page_versions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  content     JSONB NOT NULL,
  created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── public.assets ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.asset_folders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  color      TEXT DEFAULT 'bg-indigo-500',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_folders_owner ON public.asset_folders(owner_id);

CREATE TABLE IF NOT EXISTS public.assets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  owner_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  folder_id   UUID REFERENCES public.asset_folders(id) ON DELETE SET NULL,
  name        TEXT NOT NULL,
  url         TEXT,
  mime_type   TEXT,
  size_bytes  INTEGER,
  type        TEXT CHECK (type IN ('image','video','document','other')),
  starred     BOOLEAN DEFAULT false,
  tags        TEXT[] DEFAULT '{}',
  used_in     TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assets_site   ON public.assets(site_id);
CREATE INDEX IF NOT EXISTS idx_assets_owner  ON public.assets(owner_id);
CREATE INDEX IF NOT EXISTS idx_assets_folder ON public.assets(folder_id);

-- ─── public.deployments ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.deployments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id               UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  status                deployment_status NOT NULL DEFAULT 'building',
  url                   TEXT,
  vercel_deployment_id  TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at           TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_deployments_site ON public.deployments(site_id);

-- ─── public.cms_collections ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cms_collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  team_id     UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  owner_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT DEFAULT '',
  fields      JSONB DEFAULT '[]',
  schema      JSONB NOT NULL DEFAULT '{"fields":[]}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_collections_owner     ON public.cms_collections(owner_id);
CREATE INDEX IF NOT EXISTS idx_cms_collections_team      ON public.cms_collections(team_id);
CREATE INDEX IF NOT EXISTS idx_cms_collections_site_slug ON public.cms_collections(site_id, slug);

-- ─── public.cms_items ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cms_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id  UUID NOT NULL REFERENCES public.cms_collections(id) ON DELETE CASCADE,
  data           JSONB NOT NULL DEFAULT '{}',
  status         TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published','draft')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_items_collection        ON public.cms_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_cms_items_collection_status ON public.cms_items(collection_id, status);

-- ─── public.forms ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.forms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  team_id     UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  owner_id    UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused')),
  fields      JSONB DEFAULT '[]',
  settings    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forms_owner ON public.forms(owner_id);
CREATE INDEX IF NOT EXISTS idx_forms_site  ON public.forms(site_id);
CREATE INDEX IF NOT EXISTS idx_forms_team  ON public.forms(team_id);

-- ─── public.form_submissions ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.form_submissions (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id  UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  form_id  TEXT NOT NULL,
  form_ref UUID REFERENCES public.forms(id) ON DELETE CASCADE,
  data     JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── public.activity_logs ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES public.users(id) ON DELETE SET NULL,
  owner_id     UUID REFERENCES public.users(id) ON DELETE CASCADE,
  team_id      UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  action_type  TEXT NOT NULL CHECK (action_type IN ('publish','edit','team','billing','deploy_failed','create','delete')),
  description  TEXT NOT NULL,
  site_id      UUID REFERENCES public.sites(id) ON DELETE SET NULL,
  metadata     JSONB DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_owner      ON public.activity_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_team       ON public.activity_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ─── public.page_views ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.page_views (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id       UUID REFERENCES public.sites(id) ON DELETE CASCADE,
  owner_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
  team_id       UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  page_path     TEXT NOT NULL DEFAULT '/',
  referrer      TEXT,
  country_code  CHAR(2),
  device_type   TEXT CHECK (device_type IN ('desktop','mobile','tablet')),
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_views_site       ON public.page_views(site_id);
CREATE INDEX IF NOT EXISTS idx_page_views_owner      ON public.page_views(owner_id);
CREATE INDEX IF NOT EXISTS idx_page_views_team       ON public.page_views(team_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at);

-- ─── public.comments ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  resolved    BOOLEAN NOT NULL DEFAULT false,
  position    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_page ON public.comments(page_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- ─── Auto-update updated_at ───────────────────────────────────────────────────

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

-- ─── Auto-create user profile + default workspace on signup ───────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  new_team_id UUID;
BEGIN
  -- Create the public.users profile row
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create the default "My Workspace" team
  INSERT INTO public.teams (name, created_by, owner_id)
  VALUES ('My Workspace', NEW.id, NEW.id)
  RETURNING id INTO new_team_id;

  -- Add the user as owner member of that team
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (new_team_id, NEW.id, 'owner')
  ON CONFLICT (team_id, user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_versions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_folders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_collections  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments         ENABLE ROW LEVEL SECURITY;

-- ─── users ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view own profile"   ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (id = auth.uid());

-- ─── teams ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Team members can view teams"          ON public.teams;
DROP POLICY IF EXISTS "Users can create teams"               ON public.teams;
DROP POLICY IF EXISTS "Owners and admins can update teams"   ON public.teams;
DROP POLICY IF EXISTS "Owners can delete their teams"        ON public.teams;

CREATE POLICY "Team members can view teams"
  ON public.teams FOR SELECT USING (
    id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create teams"
  ON public.teams FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Owners and admins can update teams"
  ON public.teams FOR UPDATE USING (
    id IN (
      SELECT team_id FROM public.team_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Owners can delete their teams"
  ON public.teams FOR DELETE USING (owner_id = auth.uid());

-- ─── team_members ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Members can view team membership"  ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team members"    ON public.team_members;

CREATE POLICY "Members can view team membership"
  ON public.team_members FOR SELECT USING (
    team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL USING (
    team_id IN (
      SELECT team_id FROM public.team_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ─── team_invites ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can manage their own invites" ON public.team_invites;

CREATE POLICY "Users can manage their own invites"
  ON public.team_invites FOR ALL USING (owner_id = auth.uid());

-- ─── sites ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view their sites"             ON public.sites;
DROP POLICY IF EXISTS "Users can create sites"                 ON public.sites;
DROP POLICY IF EXISTS "Owners and designers can update sites"  ON public.sites;
DROP POLICY IF EXISTS "Only owners and admins can delete sites" ON public.sites;

CREATE POLICY "Users can view their sites"
  ON public.sites FOR SELECT USING (
    owner_id = auth.uid()
    OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create sites"
  ON public.sites FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners and designers can update sites"
  ON public.sites FOR UPDATE USING (
    owner_id = auth.uid()
    OR team_id IN (
      SELECT team_id FROM public.team_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'designer')
    )
  );

CREATE POLICY "Only owners and admins can delete sites"
  ON public.sites FOR DELETE USING (
    owner_id = auth.uid()
    OR team_id IN (
      SELECT team_id FROM public.team_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- ─── pages ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access pages of their sites" ON public.pages;

CREATE POLICY "Users can access pages of their sites"
  ON public.pages FOR ALL USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    )
  );

-- ─── page_versions ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access page versions of their sites" ON public.page_versions;

CREATE POLICY "Users can access page versions of their sites"
  ON public.page_versions FOR ALL USING (
    page_id IN (
      SELECT id FROM public.pages WHERE
        site_id IN (
          SELECT id FROM public.sites WHERE
            owner_id = auth.uid()
            OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
        )
    )
  );

-- ─── asset_folders ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can manage their own folders" ON public.asset_folders;

CREATE POLICY "Users can manage their own folders"
  ON public.asset_folders FOR ALL USING (owner_id = auth.uid());

-- ─── assets ───────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access assets of their sites" ON public.assets;

CREATE POLICY "Users can access assets of their sites"
  ON public.assets FOR ALL USING (
    owner_id = auth.uid()
    OR site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    )
  );

-- ─── deployments ──────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view deployments of their sites"   ON public.deployments;
DROP POLICY IF EXISTS "Users can create deployments for their sites" ON public.deployments;

CREATE POLICY "Users can view deployments of their sites"
  ON public.deployments FOR SELECT USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create deployments for their sites"
  ON public.deployments FOR INSERT WITH CHECK (
    site_id IN (SELECT id FROM public.sites WHERE owner_id = auth.uid())
  );

-- ─── cms_collections ──────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access CMS collections of their sites" ON public.cms_collections;
DROP POLICY IF EXISTS cms_collections_select ON public.cms_collections;
DROP POLICY IF EXISTS cms_collections_insert ON public.cms_collections;
DROP POLICY IF EXISTS cms_collections_update ON public.cms_collections;
DROP POLICY IF EXISTS cms_collections_delete ON public.cms_collections;

CREATE POLICY cms_collections_select ON public.cms_collections FOR SELECT USING (true);
CREATE POLICY cms_collections_insert ON public.cms_collections FOR INSERT WITH CHECK (true);
CREATE POLICY cms_collections_update ON public.cms_collections FOR UPDATE USING (true);
CREATE POLICY cms_collections_delete ON public.cms_collections FOR DELETE USING (true);

-- ─── cms_items ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access CMS items of their collections" ON public.cms_items;
DROP POLICY IF EXISTS cms_items_select ON public.cms_items;
DROP POLICY IF EXISTS cms_items_insert ON public.cms_items;
DROP POLICY IF EXISTS cms_items_update ON public.cms_items;
DROP POLICY IF EXISTS cms_items_delete ON public.cms_items;

CREATE POLICY cms_items_select ON public.cms_items FOR SELECT USING (true);
CREATE POLICY cms_items_insert ON public.cms_items FOR INSERT WITH CHECK (true);
CREATE POLICY cms_items_update ON public.cms_items FOR UPDATE USING (true);
CREATE POLICY cms_items_delete ON public.cms_items FOR DELETE USING (true);

-- ─── forms ────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can manage their own forms" ON public.forms;

CREATE POLICY "Users can manage their own forms"
  ON public.forms FOR ALL USING (owner_id = auth.uid());

-- ─── form_submissions ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view form submissions for their sites" ON public.form_submissions;
DROP POLICY IF EXISTS "Anyone can submit a form" ON public.form_submissions;

CREATE POLICY "Anyone can submit a form"
  ON public.form_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view form submissions for their sites"
  ON public.form_submissions FOR SELECT USING (
    form_ref IN (SELECT id FROM public.forms WHERE owner_id = auth.uid())
    OR site_id IN (SELECT id FROM public.sites WHERE owner_id = auth.uid())
  );

-- ─── activity_logs ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view their own activity"  ON public.activity_logs;
DROP POLICY IF EXISTS "Service role can insert activity"   ON public.activity_logs;

CREATE POLICY "Users can view their own activity"
  ON public.activity_logs FOR SELECT USING (
    owner_id = auth.uid()
    OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role can insert activity"
  ON public.activity_logs FOR INSERT WITH CHECK (true);

-- ─── page_views ───────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Anyone can record a page view"       ON public.page_views;
DROP POLICY IF EXISTS "Users can view their own page views" ON public.page_views;

CREATE POLICY "Anyone can record a page view"
  ON public.page_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own page views"
  ON public.page_views FOR SELECT USING (
    owner_id = auth.uid()
    OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
  );

-- ─── comments ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Team members can view and add comments"             ON public.comments;
DROP POLICY IF EXISTS "Users can add comments to pages they can access"    ON public.comments;
DROP POLICY IF EXISTS "Comment authors can update their own comments"      ON public.comments;
DROP POLICY IF EXISTS "Comment authors and admins can delete comments"     ON public.comments;

CREATE POLICY "Team members can view and add comments"
  ON public.comments FOR SELECT USING (
    page_id IN (
      SELECT id FROM public.pages WHERE
        site_id IN (
          SELECT id FROM public.sites WHERE
            owner_id = auth.uid()
            OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
        )
    )
  );

CREATE POLICY "Users can add comments to pages they can access"
  ON public.comments FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND page_id IN (
      SELECT id FROM public.pages WHERE
        site_id IN (
          SELECT id FROM public.sites WHERE
            owner_id = auth.uid()
            OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
        )
    )
  );

CREATE POLICY "Comment authors can update their own comments"
  ON public.comments FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Comment authors and admins can delete comments"
  ON public.comments FOR DELETE USING (
    user_id = auth.uid()
    OR page_id IN (
      SELECT id FROM public.pages WHERE
        site_id IN (SELECT id FROM public.sites WHERE owner_id = auth.uid())
    )
  );

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets', 'assets', false, 52428800,
  ARRAY['image/*','video/*','application/pdf','application/octet-stream']
) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS

DROP POLICY IF EXISTS "Authenticated users can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read assets"   ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can manage their own avatars"    ON storage.objects;
DROP POLICY IF EXISTS "Users can access their own exports"    ON storage.objects;

CREATE POLICY "Authenticated users can upload assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Authenticated users can read assets"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can delete assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'assets');

CREATE POLICY "Users can manage their own avatars"
  ON storage.objects FOR ALL USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can access their own exports"
  ON storage.objects FOR ALL USING (
    bucket_id = 'exports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
