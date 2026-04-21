import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** GET /api/v1/sites/[siteId]/tables — list site-managed tables */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();
  if (siteError || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("site_tables")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [] });
}

/** POST /api/v1/sites/[siteId]/tables — create a site-managed table definition */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();
  if (siteError || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const body = await req.json();
  const { table_name, schema, rls_policy } = body;

  if (!table_name || !schema) {
    return NextResponse.json({ error: "table_name and schema are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("site_tables")
    .insert({ site_id: siteId, table_name, schema, rls_policy })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}
