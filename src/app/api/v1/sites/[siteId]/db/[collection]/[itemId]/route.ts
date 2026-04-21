/**
 * GET    /api/v1/sites/:siteId/db/:collection/:itemId  — fetch one item
 * PUT    /api/v1/sites/:siteId/db/:collection/:itemId  — replace item data
 * PATCH  /api/v1/sites/:siteId/db/:collection/:itemId  — merge-update item data
 * DELETE /api/v1/sites/:siteId/db/:collection/:itemId  — delete item
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { authorizeCrudRequest } from "@/lib/crud-auth";

type Params = { params: Promise<{ siteId: string; collection: string; itemId: string }> };

async function resolveCollection(admin: ReturnType<typeof createSupabaseAdminClient>, siteId: string, collection: string) {
  const { data } = await admin
    .from("cms_collections")
    .select("id, fields")
    .eq("site_id", siteId)
    .eq("slug", collection)
    .single();
  return data;
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: Params) {
  const { siteId, collection, itemId } = await params;
  const auth = await authorizeCrudRequest(req, siteId);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const col   = await resolveCollection(admin, siteId, collection);
  if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  const { data: item, error } = await admin
    .from("cms_items")
    .select("id, data, status, created_at, updated_at")
    .eq("id", itemId)
    .eq("collection_id", col.id)
    .single();

  if (error || !item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  return NextResponse.json({ item });
}

// ── PUT — full replace ────────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: Params) {
  const { siteId, collection, itemId } = await params;
  const auth = await authorizeCrudRequest(req, siteId);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const col   = await resolveCollection(admin, siteId, collection);
  if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { data: itemData, status } = body as { data?: Record<string, unknown>; status?: string };
  if (!itemData) return NextResponse.json({ error: "data is required" }, { status: 400 });

  const fields = (col.fields ?? []) as Array<{ name: string; required?: boolean }>;
  const missing = fields
    .filter((f) => f.required && (itemData[f.name] === undefined || itemData[f.name] === ""))
    .map((f) => f.name);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 422 });
  }

  const updates: Record<string, unknown> = { data: itemData, updated_at: new Date().toISOString() };
  if (status !== undefined) updates.status = status;

  const { data: item, error } = await admin
    .from("cms_items")
    .update(updates)
    .eq("id", itemId)
    .eq("collection_id", col.id)
    .select()
    .single();

  if (error || !item) return NextResponse.json({ error: error?.message ?? "Item not found" }, { status: 404 });
  return NextResponse.json({ item });
}

// ── PATCH — partial update (merge data fields) ────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const { siteId, collection, itemId } = await params;
  const auth = await authorizeCrudRequest(req, siteId);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const col   = await resolveCollection(admin, siteId, collection);
  if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Fetch existing item first
  const { data: existing } = await admin
    .from("cms_items")
    .select("id, data, status")
    .eq("id", itemId)
    .eq("collection_id", col.id)
    .single();
  if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const { data: patchData, status } = body as { data?: Record<string, unknown>; status?: string };

  const mergedData = { ...(existing.data as Record<string, unknown>), ...(patchData ?? {}) };
  const updates: Record<string, unknown> = { data: mergedData, updated_at: new Date().toISOString() };
  if (status !== undefined) updates.status = status;

  const { data: item, error } = await admin
    .from("cms_items")
    .update(updates)
    .eq("id", itemId)
    .eq("collection_id", col.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item });
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const { siteId, collection, itemId } = await params;
  const auth = await authorizeCrudRequest(req, siteId);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const col   = await resolveCollection(admin, siteId, collection);
  if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  const { error } = await admin
    .from("cms_items")
    .delete()
    .eq("id", itemId)
    .eq("collection_id", col.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
