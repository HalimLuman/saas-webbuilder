/**
 * GET  /api/v1/sites/:siteId/db/:collection   — list items
 * POST /api/v1/sites/:siteId/db/:collection   — create item
 *
 * Authentication: X-API-Key header  OR  Supabase session cookie.
 *
 * Query params for GET:
 *   status=published|draft|all   (default: published)
 *   page=1  limit=20
 *   sort=fieldName  order=asc|desc
 *   filter[fieldName]=value      (exact match on any data field)
 *   q=search string              (full-text across all string fields)
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { authorizeCrudRequest } from "@/lib/crud-auth";
import { PLAN_LIMITS, type PlanType } from "@/lib/plan-limits";
import type { UserProfile } from "@/lib/user-context";

type Params = { params: Promise<{ siteId: string; collection: string }> };

// ── GET — list items ──────────────────────────────────────────────────────────
export async function GET(req: NextRequest, { params }: Params) {
  const { siteId, collection } = await params;

  const auth = await authorizeCrudRequest(req, siteId);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Resolve collection by slug — try site-specific first, then global (site_id IS NULL)
  let col: { id: string; name: string; slug: string; fields: unknown } | null = null;
  const { data: siteCol } = await admin
    .from("cms_collections")
    .select("id, name, slug, fields")
    .eq("site_id", siteId)
    .eq("slug", collection)
    .maybeSingle();
  if (siteCol) {
    col = siteCol;
  } else {
    const { data: globalCol } = await admin
      .from("cms_collections")
      .select("id, name, slug, fields")
      .is("site_id", null)
      .eq("slug", collection)
      .maybeSingle();
    col = globalCol ?? null;
  }
  if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  const url    = new URL(req.url);
  const sp     = url.searchParams;
  const status = sp.get("status") ?? "published";
  const page   = Math.max(1, parseInt(sp.get("page")  ?? "1",  10));
  const limit  = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "20", 10)));
  const sortField = sp.get("sort")  ?? "created_at";
  const sortOrder = (sp.get("order") ?? "desc") === "asc";
  const q     = sp.get("q") ?? "";

  let query = admin
    .from("cms_items")
    .select("id, data, status, created_at, updated_at", { count: "exact" })
    .eq("collection_id", col.id);

  if (status !== "all") query = query.eq("status", status);
  query = query.order("created_at", { ascending: sortOrder });

  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);

  const { data: items, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Optional: client-side q filter (simple substring match across data values)
  let results = items ?? [];
  if (q) {
    const lq = q.toLowerCase();
    results = results.filter((item) => {
      const values = Object.values(item.data ?? {});
      return values.some((v) => String(v).toLowerCase().includes(lq));
    });
  }

  // Optional: filter[field]=value
  for (const [key, val] of sp.entries()) {
    if (key.startsWith("filter[") && key.endsWith("]")) {
      const field = key.slice(7, -1);
      results = results.filter((item) => String(item.data?.[field] ?? "") === val);
    }
  }

  const total = count ?? 0;
  return NextResponse.json({
    collection: { id: col.id, name: col.name, slug: col.slug, fields: col.fields },
    items: results,
    total,
    page,
    limit,
    hasMore: from + limit < total,
  });
}

// ── POST — create item ────────────────────────────────────────────────────────
export async function POST(req: NextRequest, { params }: Params) {
  const { siteId, collection } = await params;

  const auth = await authorizeCrudRequest(req, siteId);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  const { data: col } = await admin
    .from("cms_collections")
    .select("id, fields")
    .eq("site_id", siteId)
    .eq("slug", collection)
    .single();
  if (!col) return NextResponse.json({ error: "Collection not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data: itemData, status = "published" } = body as {
    data?: Record<string, unknown>;
    status?: string;
  };

  if (!itemData || typeof itemData !== "object") {
    return NextResponse.json({ error: "data field is required" }, { status: 400 });
  }

  // Validate required fields defined in the collection schema
  const fields = (col.fields ?? []) as Array<{ name: string; required?: boolean }>;
  const missing = fields
    .filter((f) => f.required && (itemData[f.name] === undefined || itemData[f.name] === ""))
    .map((f) => f.name);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 422 });
  }

  // Enforce record limits
  const { data: userProfile } = await admin
    .from("users")
    .select("plan")
    .eq("id", auth.ownerId)
    .single();

  const userPlan: PlanType = (userProfile as UserProfile)?.plan || "free";
  const maxRecords = PLAN_LIMITS[userPlan].maxRecordsPerCollection;

  const { count } = await admin
    .from("cms_items")
    .select("*", { count: "exact", head: true })
    .eq("collection_id", col.id);

  if (count !== null && count >= maxRecords) {
    return NextResponse.json(
      { error: "LimitReached", message: `Your current ${userPlan} plan allows up to ${maxRecords} records per collection. Upgrade to continue.` },
      { status: 403 }
    );
  }

  const { data: item, error } = await admin
    .from("cms_items")
    .insert({ collection_id: col.id, data: itemData, status })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ item }, { status: 201 });
}
