/**
 * Shared authentication helper for the live CRUD routes.
 *
 * A request is authorised if it carries either:
 *   (a) a valid Supabase session cookie whose user owns the site, OR
 *   (b) a valid site API key in the  X-API-Key  or  Authorization: Bearer  header.
 *
 * Returns an auth context or null (caller should respond 401).
 */

import { type NextRequest } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export interface CrudAuthContext {
  siteId: string;
  ownerId: string;
  via: "session" | "api_key";
}

export async function authorizeCrudRequest(
  req: NextRequest,
  siteId: string
): Promise<CrudAuthContext | null> {
  const admin = createSupabaseAdminClient();

  // ── 1. Try API key first (used by published sites / external callers) ────────
  const rawAuth = req.headers.get("authorization") ?? "";
  const apiKey =
    req.headers.get("x-api-key") ??
    (rawAuth.startsWith("Bearer ") ? rawAuth.slice(7) : null);

  if (apiKey) {
    const { data: site } = await admin
      .from("sites")
      .select("id, owner_id")
      .eq("id", siteId)
      .eq("api_key", apiKey)
      .single();

    if (site) {
      return { siteId: site.id, ownerId: site.owner_id, via: "api_key" };
    }
    // Key provided but invalid → reject immediately (don't fall through to session)
    return null;
  }

  // ── 2. Fall back to Supabase session cookie (used by the editor / preview) ──
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: site } = await admin
      .from("sites")
      .select("id, owner_id")
      .eq("id", siteId)
      .eq("owner_id", user.id)
      .single();

    if (site) {
      return { siteId: site.id, ownerId: site.owner_id, via: "session" };
    }
  } catch {
    // createSupabaseServerClient() can fail outside request context
  }

  return null;
}
