-- ============================================================
-- Migration 004: Workspace columns + default workspace trigger
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- ─── 1. Add owner_id to teams (mirrors created_by, allows ownership transfer) ──

ALTER TABLE public.teams
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Back-fill from created_by
UPDATE public.teams SET owner_id = created_by WHERE owner_id IS NULL;

-- Make it NOT NULL after back-fill
ALTER TABLE public.teams ALTER COLUMN owner_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);

-- ─── 2. Add team_id to team_invites (scope invites to a specific workspace) ─────

ALTER TABLE public.team_invites
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE;

-- Back-fill: match invites to the first team owned by owner_id
UPDATE public.team_invites ti
SET team_id = (
  SELECT id FROM public.teams WHERE owner_id = ti.owner_id LIMIT 1
)
WHERE ti.team_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_team_invites_team ON public.team_invites(team_id);

-- ─── 3. Extend handle_new_user trigger to provision a default workspace ──────────

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

-- ─── 4. RLS: allow owners to delete their own teams ─────────────────────────────

DROP POLICY IF EXISTS "Owners can delete their teams" ON public.teams;
CREATE POLICY "Owners can delete their teams"
  ON public.teams FOR DELETE USING (owner_id = auth.uid());
