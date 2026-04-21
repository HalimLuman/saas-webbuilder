/**
 * GET /api/v1/cms/items?slug=blog-posts&status=published&limit=10&page=1
 *
 * Public-friendly CMS item fetcher — looks up a collection by slug and
 * returns its items. Used by the canvas CMS List renderer.
 *
 * Auth: Supabase session cookie (editor/preview) or no auth for published items.
 * When unauthenticated, only published items are returned.
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sp = url.searchParams;

  const slug   = sp.get("slug") ?? "";
  const status = sp.get("status") ?? "published";
  const limit  = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "20", 10)));
  const page   = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const q      = sp.get("q") ?? "";

  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  // Resolve user (optional — unauthenticated requests can still read published items)
  let userId: string | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch { /* outside request context or no session */ }

  // Find collection by slug
  // If authenticated: search own collections first, then fall back to public/unowned
  // If not authenticated: only public slug lookup
  let collectionQuery = admin
    .from("cms_collections")
    .select("id, name, slug, fields")
    .eq("slug", slug);

  if (userId) collectionQuery = collectionQuery.eq("owner_id", userId);

  const { data: collection } = await collectionQuery.maybeSingle();

  if (!collection) {
    return NextResponse.json({ error: `Collection "${slug}" not found` }, { status: 404 });
  }

  // Fetch items
  let itemsQuery = admin
    .from("cms_items")
    .select("id, data, status, created_at, updated_at", { count: "exact" })
    .eq("collection_id", collection.id);

  // Unauthenticated access: always force published only (safety)
  const effectiveStatus = !userId ? "published" : status;
  if (effectiveStatus !== "all") itemsQuery = itemsQuery.eq("status", effectiveStatus);

  const from = (page - 1) * limit;
  itemsQuery = itemsQuery.order("created_at", { ascending: false }).range(from, from + limit - 1);

  const { data: items, error, count } = await itemsQuery;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let results = items ?? [];
  if (q) {
    const lq = q.toLowerCase();
    results = results.filter((item) =>
      Object.values(item.data ?? {}).some((v) => String(v).toLowerCase().includes(lq))
    );
  }

  return NextResponse.json({
    collection: { id: collection.id, name: collection.name, slug: collection.slug, fields: collection.fields },
    items: results,
    total: count ?? 0,
    page,
    limit,
  });
}
