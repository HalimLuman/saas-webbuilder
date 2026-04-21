import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteRoute } from "@/lib/types";
import { nanoid } from "nanoid";

/** GET /api/v1/sites/[siteId]/routes — list custom site routes */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: site, error } = await supabase
    .from("sites")
    .select("id, site_routes")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  return NextResponse.json({ data: (site.site_routes as SiteRoute[]) ?? [] });
}

/** POST /api/v1/sites/[siteId]/routes — create a custom site route */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: site, error } = await supabase
    .from("sites")
    .select("id, site_routes")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const body = await req.json();
  const newRoute: SiteRoute = {
    id: nanoid(),
    path: body.path ?? "/api/untitled",
    method: body.method ?? "POST",
    auth: body.auth ?? "public",
    steps: body.steps ?? [],
  };

  const existing = (site.site_routes as SiteRoute[]) ?? [];
  const updated = [...existing, newRoute];

  const { error: updateError } = await supabase
    .from("sites")
    .update({ site_routes: updated, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: newRoute }, { status: 201 });
}

/** DELETE /api/v1/sites/[siteId]/routes?routeId=xxx — delete a route */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const routeId = req.nextUrl.searchParams.get("routeId");
  if (!routeId) return NextResponse.json({ error: "routeId required" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: site, error } = await supabase
    .from("sites")
    .select("id, site_routes")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const updated = ((site.site_routes as SiteRoute[]) ?? []).filter((r) => r.id !== routeId);

  const { error: updateError } = await supabase
    .from("sites")
    .update({ site_routes: updated, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: { id: routeId, deleted: true } });
}
