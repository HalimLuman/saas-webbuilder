/**
 * GET  /api/v1/sites/:siteId/api-key  — return the site's current API key
 * POST /api/v1/sites/:siteId/api-key  — regenerate and return a new API key
 *
 * Only the site owner (authenticated via Supabase session) can access these.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ siteId: string }> };

async function getOwner(siteId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createSupabaseAdminClient();
  const { data: site } = await admin
    .from("sites")
    .select("id, api_key")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  return site ? { user, site, admin } : null;
}

// ── GET — return current key ──────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { siteId } = await params;
  const ctx = await getOwner(siteId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ apiKey: ctx.site.api_key });
}

// ── POST — rotate / regenerate key ───────────────────────────────────────────
export async function POST(_req: NextRequest, { params }: Params) {
  const { siteId } = await params;
  const ctx = await getOwner(siteId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Generate new key: sk_live_ + 32 random hex chars
  const array  = new Uint8Array(16);
  crypto.getRandomValues(array);
  const newKey = "sk_live_" + Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");

  const { error } = await ctx.admin
    .from("sites")
    .update({ api_key: newKey, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ apiKey: newKey });
}
