-- ============================================================
-- Migration 006: Fix infinite recursion in RLS policies
-- Run in Supabase Dashboard → SQL Editor → Run
--
-- Root cause: policies on team_members reference team_members
-- in subqueries, causing infinite recursion. Every table that
-- checks team membership via an inline subquery is affected.
--
-- Fix: SECURITY DEFINER helper functions that query team_members
-- without triggering RLS, used in place of inline subqueries.
-- ============================================================

-- ─── 1. Helper functions ──────────────────────────────────────────────────────

-- Returns all team_ids the current user belongs to (any role).
CREATE OR REPLACE FUNCTION public.get_my_team_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT team_id FROM public.team_members WHERE user_id = auth.uid();
$$;

-- Returns team_ids where the current user has one of the given roles.
CREATE OR REPLACE FUNCTION public.get_my_team_ids_with_roles(roles public.team_role[])
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT team_id FROM public.team_members
  WHERE user_id = auth.uid() AND role = ANY(roles);
$$;

-- ─── 2. team_members ──────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Members can view team membership" ON public.team_members;
DROP POLICY IF EXISTS "Admins can manage team members"  ON public.team_members;

-- Users can see their own membership row, plus all rows for teams they belong to.
CREATE POLICY "Members can view team membership"
  ON public.team_members FOR SELECT USING (
    user_id = auth.uid()
    OR team_id IN (SELECT public.get_my_team_ids())
  );

-- Only team owners/admins can mutate team_members rows.
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL USING (
    team_id IN (SELECT public.get_my_team_ids_with_roles(ARRAY['owner', 'admin']::public.team_role[]))
  );

-- ─── 3. teams ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Team members can view teams"        ON public.teams;
DROP POLICY IF EXISTS "Owners and admins can update teams" ON public.teams;

CREATE POLICY "Team members can view teams"
  ON public.teams FOR SELECT USING (
    id IN (SELECT public.get_my_team_ids())
  );

CREATE POLICY "Owners and admins can update teams"
  ON public.teams FOR UPDATE USING (
    id IN (SELECT public.get_my_team_ids_with_roles(ARRAY['owner', 'admin']::public.team_role[]))
  );

-- ─── 4. sites ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view their sites"              ON public.sites;
DROP POLICY IF EXISTS "Owners and designers can update sites"   ON public.sites;
DROP POLICY IF EXISTS "Only owners and admins can delete sites" ON public.sites;

CREATE POLICY "Users can view their sites"
  ON public.sites FOR SELECT USING (
    owner_id = auth.uid()
    OR team_id IN (SELECT public.get_my_team_ids())
  );

CREATE POLICY "Owners and designers can update sites"
  ON public.sites FOR UPDATE USING (
    owner_id = auth.uid()
    OR team_id IN (SELECT public.get_my_team_ids_with_roles(ARRAY['owner', 'admin', 'designer']::public.team_role[]))
  );

CREATE POLICY "Only owners and admins can delete sites"
  ON public.sites FOR DELETE USING (
    owner_id = auth.uid()
    OR team_id IN (SELECT public.get_my_team_ids_with_roles(ARRAY['owner', 'admin']::public.team_role[]))
  );

-- ─── 5. pages ─────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access pages of their sites" ON public.pages;

CREATE POLICY "Users can access pages of their sites"
  ON public.pages FOR ALL USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT public.get_my_team_ids())
    )
  );

-- ─── 6. assets ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access assets of their sites" ON public.assets;

CREATE POLICY "Users can access assets of their sites"
  ON public.assets FOR ALL USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT public.get_my_team_ids())
    )
  );

-- ─── 7. deployments ───────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view deployments of their sites"   ON public.deployments;
DROP POLICY IF EXISTS "Users can create deployments for their sites" ON public.deployments;

CREATE POLICY "Users can view deployments of their sites"
  ON public.deployments FOR SELECT USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT public.get_my_team_ids())
    )
  );

CREATE POLICY "Users can create deployments for their sites"
  ON public.deployments FOR INSERT WITH CHECK (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT public.get_my_team_ids_with_roles(ARRAY['owner', 'admin', 'designer']::public.team_role[]))
    )
  );

-- ─── 8. cms_collections ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access CMS collections of their sites" ON public.cms_collections;

CREATE POLICY "Users can access CMS collections of their sites"
  ON public.cms_collections FOR ALL USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT public.get_my_team_ids())
    )
  );

-- ─── 9. cms_items ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access CMS items of their collections" ON public.cms_items;

CREATE POLICY "Users can access CMS items of their collections"
  ON public.cms_items FOR ALL USING (
    collection_id IN (
      SELECT id FROM public.cms_collections WHERE
        site_id IN (
          SELECT id FROM public.sites WHERE
            owner_id = auth.uid()
            OR team_id IN (SELECT public.get_my_team_ids())
        )
    )
  );

-- ─── 10. form_submissions ─────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view form submissions for their sites" ON public.form_submissions;

CREATE POLICY "Users can view form submissions for their sites"
  ON public.form_submissions FOR SELECT USING (
    site_id IN (
      SELECT id FROM public.sites WHERE
        owner_id = auth.uid()
        OR team_id IN (SELECT public.get_my_team_ids())
    )
  );

-- ─── 11. comments ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Team members can view and add comments"            ON public.comments;
DROP POLICY IF EXISTS "Users can add comments to pages they can access"   ON public.comments;

CREATE POLICY "Team members can view and add comments"
  ON public.comments FOR SELECT USING (
    page_id IN (
      SELECT id FROM public.pages WHERE
        site_id IN (
          SELECT id FROM public.sites WHERE
            owner_id = auth.uid()
            OR team_id IN (SELECT public.get_my_team_ids())
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
            OR team_id IN (SELECT public.get_my_team_ids())
        )
    )
  );

-- ─── 12. page_versions ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can access page versions of their sites" ON public.page_versions;

CREATE POLICY "Users can access page versions of their sites"
  ON public.page_versions FOR ALL USING (
    page_id IN (
      SELECT id FROM public.pages WHERE
        site_id IN (
          SELECT id FROM public.sites WHERE
            owner_id = auth.uid()
            OR team_id IN (SELECT public.get_my_team_ids())
        )
    )
  );
