-- ============================================================
-- BuildStack — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE plan AS ENUM ('free', 'pro', 'business', 'enterprise');
CREATE TYPE site_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE team_role AS ENUM ('owner', 'admin', 'designer', 'editor', 'viewer');
CREATE TYPE deployment_status AS ENUM ('building', 'ready', 'failed', 'cancelled');

-- ─── public.users ─────────────────────────────────────────────────────────────
-- Extends auth.users with app-specific profile data.

CREATE TABLE public.users (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                 TEXT UNIQUE NOT NULL,
  name                  TEXT,
  avatar_url            TEXT,
  plan                  plan NOT NULL DEFAULT 'free',
  ai_credits_used       INTEGER NOT NULL DEFAULT 0,
  ai_credits_limit      INTEGER NOT NULL DEFAULT 50,
  ls_customer_id        TEXT UNIQUE,
  onboarding_completed  BOOLEAN NOT NULL DEFAULT false,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email  ON public.users(email);
CREATE INDEX idx_users_ls_customer ON public.users(ls_customer_id);

-- Auto-create a public.users row when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── public.teams ─────────────────────────────────────────────────────────────

CREATE TABLE public.teams (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  plan                    TEXT NOT NULL DEFAULT 'free',
  stripe_subscription_id  TEXT,
  created_by              UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── public.team_members ──────────────────────────────────────────────────────

CREATE TABLE public.team_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role        team_role NOT NULL DEFAULT 'viewer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);

-- ─── public.sites ─────────────────────────────────────────────────────────────

CREATE TABLE public.sites (
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
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at        TIMESTAMPTZ
);

CREATE INDEX idx_sites_owner    ON public.sites(owner_id);
CREATE INDEX idx_sites_team     ON public.sites(team_id);
CREATE INDEX idx_sites_status   ON public.sites(status);

-- ─── public.pages ─────────────────────────────────────────────────────────────

CREATE TABLE public.pages (
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

CREATE INDEX idx_pages_site ON public.pages(site_id);

-- ─── public.assets ────────────────────────────────────────────────────────────

CREATE TABLE public.assets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  mime_type   TEXT,
  size_bytes  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assets_site ON public.assets(site_id);

-- ─── public.deployments ───────────────────────────────────────────────────────

CREATE TABLE public.deployments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id               UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  status                deployment_status NOT NULL DEFAULT 'building',
  url                   TEXT,
  vercel_deployment_id  TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at           TIMESTAMPTZ
);

CREATE INDEX idx_deployments_site ON public.deployments(site_id);

-- ─── public.cms_collections ───────────────────────────────────────────────────

CREATE TABLE public.cms_collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  schema      JSONB NOT NULL DEFAULT '{"fields":[]}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(site_id, slug)
);

-- ─── public.cms_items ─────────────────────────────────────────────────────────

CREATE TABLE public.cms_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id  UUID NOT NULL REFERENCES public.cms_collections(id) ON DELETE CASCADE,
  data           JSONB NOT NULL DEFAULT '{}',
  published      BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cms_items_collection ON public.cms_items(collection_id);

-- ─── public.form_submissions ──────────────────────────────────────────────────

CREATE TABLE public.form_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id     UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  form_id     TEXT NOT NULL,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── public.comments ──────────────────────────────────────────────────────────

CREATE TABLE public.comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  resolved    BOOLEAN NOT NULL DEFAULT false,
  position    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_page ON public.comments(page_id);

-- ─── public.page_versions ─────────────────────────────────────────────────────

CREATE TABLE public.page_versions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  content     JSONB NOT NULL,
  created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_versions   ENABLE ROW LEVEL SECURITY;

-- ─── users ────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (id = auth.uid());

-- ─── teams ────────────────────────────────────────────────────────────────────

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

-- ─── team_members ─────────────────────────────────────────────────────────────

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

-- ─── sites ────────────────────────────────────────────────────────────────────

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

CREATE POLICY "Users can access pages of their sites"
  ON public.pages FOR ALL USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    )
  );

-- ─── assets ───────────────────────────────────────────────────────────────────

CREATE POLICY "Users can access assets of their sites"
  ON public.assets FOR ALL USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    )
  );

-- ─── deployments ──────────────────────────────────────────────────────────────

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

CREATE POLICY "Users can access CMS collections of their sites"
  ON public.cms_collections FOR ALL USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    )
  );

-- ─── cms_items ────────────────────────────────────────────────────────────────

CREATE POLICY "Users can access CMS items of their collections"
  ON public.cms_items FOR ALL USING (
    collection_id IN (
      SELECT id FROM public.cms_collections WHERE
        site_id IN (
          SELECT id FROM public.sites WHERE
            owner_id = auth.uid()
            OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
        )
    )
  );

-- ─── form_submissions ─────────────────────────────────────────────────────────

CREATE POLICY "Users can view form submissions for their sites"
  ON public.form_submissions FOR SELECT USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT team_id FROM public.team_members WHERE user_id = auth.uid())
    )
  );

-- ─── comments ─────────────────────────────────────────────────────────────────

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
        site_id IN (
          SELECT id FROM public.sites WHERE owner_id = auth.uid()
        )
    )
  );

-- ─── page_versions ────────────────────────────────────────────────────────────

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

-- ============================================================
-- Storage Buckets
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

-- Storage RLS

CREATE POLICY "Anyone can view public assets"
  ON storage.objects FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Users can upload assets to their sites"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'assets'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.sites WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own assets"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'assets'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.sites WHERE owner_id = auth.uid()
    )
  );

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
