import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ siteId: string; tableName: string }> };

async function verifySiteOwner(siteId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: site, error } = await supabase
    .from("sites")
    .select("id")
    .eq("id", siteId)
    .eq("owner_id", userId)
    .single();
  return { owned: !error && !!site, supabase };
}

/** GET — fetch table schema definition */
export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  const { siteId, tableName } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { owned } = await verifySiteOwner(siteId, user.id);
  if (!owned) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("site_tables")
    .select("*")
    .eq("site_id", siteId)
    .eq("table_name", tableName)
    .single();

  if (error || !data) return NextResponse.json({ error: "Table not found" }, { status: 404 });

  return NextResponse.json({ data });
}

/** PUT — update table schema definition */
export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, tableName } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { owned } = await verifySiteOwner(siteId, user.id);
  if (!owned) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const body = await req.json();

  const { data, error } = await supabase
    .from("site_tables")
    .update({ schema: body.schema, rls_policy: body.rls_policy })
    .eq("site_id", siteId)
    .eq("table_name", tableName)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

/** DELETE — remove table definition */
export async function DELETE(
  _req: NextRequest,
  { params }: Params
) {
  const { siteId, tableName } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { owned } = await verifySiteOwner(siteId, user.id);
  if (!owned) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const { error } = await supabase
    .from("site_tables")
    .delete()
    .eq("site_id", siteId)
    .eq("table_name", tableName);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: { tableName, deleted: true } });
}
