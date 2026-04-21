import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { resolveWorkspace } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId");

  const admin = createSupabaseAdminClient();
  const ws = await resolveWorkspace(req, user.id);

  let query = admin
    .from("cms_collections")
    .select("id, name, slug, description, fields, site_id, team_id, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (ws) {
    query = query.eq("team_id", ws.teamId);
  } else {
    query = query.eq("owner_id", user.id);
  }

  if (siteId) query = query.eq("site_id", siteId);

  const { data: collections, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const collectionIds = (collections ?? []).map((c) => c.id);
  let publishedCounts: Record<string, number> = {};
  let draftCounts: Record<string, number> = {};

  if (collectionIds.length > 0) {
    const { data: items } = await admin
      .from("cms_items")
      .select("collection_id, status")
      .in("collection_id", collectionIds);

    (items ?? []).forEach((item) => {
      if (item.status === "published") {
        publishedCounts[item.collection_id] = (publishedCounts[item.collection_id] ?? 0) + 1;
      } else {
        draftCounts[item.collection_id] = (draftCounts[item.collection_id] ?? 0) + 1;
      }
    });
  }

  const result = (collections ?? []).map((c) => ({
    ...c,
    itemCount: (publishedCounts[c.id] ?? 0) + (draftCounts[c.id] ?? 0),
    publishedCount: publishedCounts[c.id] ?? 0,
    draftCount: draftCounts[c.id] ?? 0,
  }));

  return NextResponse.json({ siteId: siteId ?? "all", collections: result, total: result.length });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, fields, site_id } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Collection name is required" }, { status: 400 });

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const admin = createSupabaseAdminClient();
    const ws = await resolveWorkspace(req, user.id);

    const { data, error } = await admin.from("cms_collections").insert({
      owner_id: user.id,
      team_id: ws?.teamId ?? null,
      site_id: site_id ?? null,
      name,
      slug,
      description: description ?? "",
      fields: fields ?? [],
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ collection: { ...data, itemCount: 0, publishedCount: 0, draftCount: 0 } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get("collectionId");
  if (!collectionId) return NextResponse.json({ error: "collectionId is required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("cms_collections").delete().eq("id", collectionId).eq("owner_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
