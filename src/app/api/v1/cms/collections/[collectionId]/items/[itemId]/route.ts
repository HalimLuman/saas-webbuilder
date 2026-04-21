import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ collectionId: string; itemId: string }> };

async function verifyOwnership(collectionId: string, userId: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("cms_collections")
    .select("id")
    .eq("id", collectionId)
    .eq("owner_id", userId)
    .single();
  return !!data;
}

/** PATCH /api/v1/cms/collections/[collectionId]/items/[itemId] */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { collectionId, itemId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await verifyOwnership(collectionId, user.id)))
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  const body = await req.json();
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.data !== undefined) patch.data = body.data;
  if (body.status !== undefined) patch.status = body.status;

  const admin = createSupabaseAdminClient();
  const { data: item, error } = await admin
    .from("cms_items")
    .update(patch)
    .eq("id", itemId)
    .eq("collection_id", collectionId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item });
}

/** DELETE /api/v1/cms/collections/[collectionId]/items/[itemId] */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { collectionId, itemId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await verifyOwnership(collectionId, user.id)))
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("cms_items")
    .delete()
    .eq("id", itemId)
    .eq("collection_id", collectionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
