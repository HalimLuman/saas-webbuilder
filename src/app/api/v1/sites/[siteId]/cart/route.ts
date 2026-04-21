import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** GET /api/v1/sites/[siteId]/cart — get cart items for a session */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const sessionId = req.headers.get("x-session-id") ?? req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "Session ID required" }, { status: 400 });

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select("*, product:product_id(*)")
    .eq("site_id", siteId)
    .eq("session_id", sessionId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [] });
}

/** POST /api/v1/sites/[siteId]/cart — add item to cart */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const body = await req.json();
  const { product_id, quantity = 1, session_id, user_id } = body;

  if (!product_id || !session_id) {
    return NextResponse.json({ error: "product_id and session_id required" }, { status: 400 });
  }

  // Upsert: increment quantity if item already in cart
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("site_id", siteId)
    .eq("session_id", session_id)
    .eq("product_id", product_id)
    .single();

  let data, error;
  if (existing) {
    ({ data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select()
      .single());
  } else {
    ({ data, error } = await supabase
      .from("cart_items")
      .insert({ site_id: siteId, product_id, quantity, session_id, user_id: user_id ?? null })
      .select()
      .single());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data }, { status: 201 });
}

/** DELETE /api/v1/sites/[siteId]/cart — remove item or clear cart */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { product_id, session_id, clear_all } = await req.json();

  if (!session_id) return NextResponse.json({ error: "session_id required" }, { status: 400 });

  let query = supabase.from("cart_items").delete().eq("site_id", siteId).eq("session_id", session_id);

  if (!clear_all && product_id) {
    query = query.eq("product_id", product_id);
  }

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: { cleared: true } });
}
