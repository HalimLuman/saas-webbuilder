-- ============================================================
-- Migration 005: Scope all resources to a workspace (team_id)
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── cms_collections ──────────────────────────────────────────────────────────
ALTER TABLE public.cms_collections
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE;

-- Back-fill: assign to the first team owned by owner_id
UPDATE public.cms_collections cc
SET team_id = (
  SELECT id FROM public.teams WHERE owner_id = cc.owner_id LIMIT 1
)
WHERE cc.team_id IS NULL AND cc.owner_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cms_collections_team ON public.cms_collections(team_id);

-- ─── forms ────────────────────────────────────────────────────────────────────
ALTER TABLE public.forms
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE;

UPDATE public.forms f
SET team_id = (
  SELECT id FROM public.teams WHERE owner_id = f.owner_id LIMIT 1
)
WHERE f.team_id IS NULL AND f.owner_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_forms_team ON public.forms(team_id);

-- ─── activity_logs ────────────────────────────────────────────────────────────
ALTER TABLE public.activity_logs
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE;

UPDATE public.activity_logs al
SET team_id = (
  SELECT id FROM public.teams WHERE owner_id = al.owner_id LIMIT 1
)
WHERE al.team_id IS NULL AND al.owner_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_activity_logs_team ON public.activity_logs(team_id);

-- ─── page_views ───────────────────────────────────────────────────────────────
ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE;

UPDATE public.page_views pv
SET team_id = (
  SELECT id FROM public.teams WHERE owner_id = pv.owner_id LIMIT 1
)
WHERE pv.team_id IS NULL AND pv.owner_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_page_views_team ON public.page_views(team_id);

-- ─── sites: ensure team_id is populated for existing sites ────────────────────
-- sites already has team_id column; back-fill from owner's default workspace
UPDATE public.sites s
SET team_id = (
  SELECT id FROM public.teams WHERE owner_id = s.owner_id LIMIT 1
)
WHERE s.team_id IS NULL;
