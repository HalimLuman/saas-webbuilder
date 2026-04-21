import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** GET /api/v1/sites/[siteId]/orders — list orders for the site */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify site ownership
  const { data: site } = await supabase
    .from("sites")
    .select("id")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const status = req.nextUrl.searchParams.get("status");
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? 50);
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0);

  let query = supabase
    .from("orders")
    .select("*, order_items(*, product:product_id(*))", { count: "exact" })
    .eq("site_id", siteId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) query = query.eq("status", status);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], count });
}

/** POST /api/v1/sites/[siteId]/orders — create an order (called from published site) */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const body = await req.json();
  const { user_id, items, total_amount, currency = "usd", shipping_address, stripe_payment_intent_id, metadata } = body;

  if (!items?.length || !total_amount) {
    return NextResponse.json({ error: "items and total_amount required" }, { status: 400 });
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      site_id: siteId,
      user_id: user_id ?? null,
      status: "pending",
      total_amount,
      currency,
      stripe_payment_intent_id: stripe_payment_intent_id ?? null,
      shipping_address: shipping_address ?? null,
      metadata: metadata ?? null,
    })
    .select()
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  // Create order items
  const orderItems = items.map((item: { product_id: string; quantity: number; unit_price: number; metadata?: unknown }) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    metadata: item.metadata ?? null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  return NextResponse.json({ data: order }, { status: 201 });
}
