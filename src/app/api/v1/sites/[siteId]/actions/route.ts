import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BackendAction } from "@/lib/types";
import { nanoid } from "nanoid";

async function getSiteAndVerifyOwner(siteId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: site, error } = await supabase
    .from("sites")
    .select("id, backend_actions")
    .eq("id", siteId)
    .eq("owner_id", userId)
    .single();
  return { site, error, supabase };
}

/** GET /api/v1/sites/[siteId]/actions — list all backend actions */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { site, error } = await getSiteAndVerifyOwner(siteId, user.id);
  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  return NextResponse.json({ data: (site.backend_actions as BackendAction[]) ?? [] });
}

/** POST /api/v1/sites/[siteId]/actions — create a new backend action */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { site, error, supabase: sb } = await getSiteAndVerifyOwner(siteId, user.id);
  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const body = await req.json();
  const newAction: BackendAction = {
    id: nanoid(),
    name: body.name ?? "Untitled Action",
    type: body.type ?? "db.insert",
    config: body.config ?? {},
    auth: body.auth ?? "public",
    onSuccess: body.onSuccess,
    onError: body.onError,
  };

  const existing = (site.backend_actions as BackendAction[]) ?? [];
  const updated = [...existing, newAction];

  const { error: updateError } = await sb
    .from("sites")
    .update({ backend_actions: updated, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: newAction }, { status: 201 });
}
