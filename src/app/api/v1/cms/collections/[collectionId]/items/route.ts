import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ collectionId: string }> };

/** GET /api/v1/cms/collections/[collectionId]/items */
export async function GET(req: NextRequest, { params }: Params) {
  const { collectionId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Verify ownership
  const { data: col } = await admin
    .from("cms_collections")
    .select("id")
    .eq("id", collectionId)
    .eq("owner_id", user.id)
    .single();
  if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  const url = new URL(req.url);
  const sp = url.searchParams;
  const status = sp.get("status") ?? "all";
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(sp.get("limit") ?? "20", 10));
  const q = sp.get("q") ?? "";

  let query = admin
    .from("cms_items")
    .select("id, data, status, created_at, updated_at", { count: "exact" })
    .eq("collection_id", collectionId)
    .order("created_at", { ascending: false });

  if (status !== "all") query = query.eq("status", status);

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data: items, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let results = items ?? [];
  if (q) {
    const lq = q.toLowerCase();
    results = results.filter((item) =>
      Object.values(item.data ?? {}).some((v) => String(v).toLowerCase().includes(lq))
    );
  }

  return NextResponse.json({ items: results, total: count ?? 0, page, limit });
}

/** POST /api/v1/cms/collections/[collectionId]/items */
export async function POST(req: NextRequest, { params }: Params) {
  const { collectionId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  const { data: col } = await admin
    .from("cms_collections")
    .select("id")
    .eq("id", collectionId)
    .eq("owner_id", user.id)
    .single();
  if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  const body = await req.json();
  const { data, status = "draft" } = body;

  const { data: item, error } = await admin
    .from("cms_items")
    .insert({ collection_id: collectionId, data: data ?? {}, status })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item }, { status: 201 });
}
