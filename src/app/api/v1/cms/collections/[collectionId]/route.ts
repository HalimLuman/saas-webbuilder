import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ collectionId: string }> };

/** GET /api/v1/cms/collections/[collectionId] — single collection with item counts */
export async function GET(_req: NextRequest, { params }: Params) {
  const { collectionId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const { data: col, error } = await admin
    .from("cms_collections")
    .select("id, name, slug, description, fields, site_id, created_at, updated_at")
    .eq("id", collectionId)
    .eq("owner_id", user.id)
    .single();

  if (error || !col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  const { data: items } = await admin
    .from("cms_items")
    .select("status")
    .eq("collection_id", collectionId);

  const published = (items ?? []).filter((i) => i.status === "published").length;
  const draft = (items ?? []).filter((i) => i.status !== "published").length;

  return NextResponse.json({
    collection: { ...col, itemCount: published + draft, publishedCount: published, draftCount: draft },
  });
}

/** PATCH /api/v1/cms/collections/[collectionId] — update name / description / fields */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { collectionId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const admin = createSupabaseAdminClient();

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.name !== undefined) {
    patch.name = body.name;
    patch.slug = String(body.name).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
  if (body.description !== undefined) patch.description = body.description;
  if (body.fields !== undefined) patch.fields = body.fields;

  const { data, error } = await admin
    .from("cms_collections")
    .update(patch)
    .eq("id", collectionId)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ collection: data });
}
