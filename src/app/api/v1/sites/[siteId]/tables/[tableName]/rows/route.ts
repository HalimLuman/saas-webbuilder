import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ siteId: string; tableName: string }> };

/** GET — list rows from a site-managed table */
export async function GET(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, tableName } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50);
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);

  const { data, error, count } = await supabase
    .from(tableName)
    .select("*", { count: "exact" })
    .eq("site_id", siteId)
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], count });
}

/** POST — insert a row */
export async function POST(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, tableName } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error } = await supabase
    .from(tableName)
    .insert({ ...body, site_id: siteId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}

/** PUT — update rows matching a filter (pass filter as query params) */
export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, tableName } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query param required" }, { status: 400 });

  const body = await req.json();
  const { data, error } = await supabase
    .from(tableName)
    .update(body)
    .eq("id", id)
    .eq("site_id", siteId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

/** DELETE — delete a row by id */
export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, tableName } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id query param required" }, { status: 400 });

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id)
    .eq("site_id", siteId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: { id, deleted: true } });
}
