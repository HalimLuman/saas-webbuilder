import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DataSource } from "@/lib/types";
import { nanoid } from "nanoid";

/** GET /api/v1/sites/[siteId]/data — list data sources */
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
    .select("id, data_sources")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  return NextResponse.json({ data: (site.data_sources as DataSource[]) ?? [] });
}

/** POST /api/v1/sites/[siteId]/data — create a data source */
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
    .select("id, data_sources")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const body = await req.json();
  const newSource: DataSource = {
    id: nanoid(),
    name: body.name ?? "Untitled Source",
    type: body.type ?? "db.query",
    config: body.config ?? {},
    refreshOn: body.refreshOn ?? "pageLoad",
    refreshInterval: body.refreshInterval,
  };

  const existing = (site.data_sources as DataSource[]) ?? [];
  const updated = [...existing, newSource];

  const { error: updateError } = await supabase
    .from("sites")
    .update({ data_sources: updated, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: newSource }, { status: 201 });
}
