import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ siteId: string; orderId: string }> };

/** GET /api/v1/sites/[siteId]/orders/[orderId] — get order detail */
export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  const { siteId, orderId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, product:product_id(*))")
    .eq("id", orderId)
    .eq("site_id", siteId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json({ data });
}

/** PATCH /api/v1/sites/[siteId]/orders/[orderId] — update order status */
export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, orderId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowedFields = ["status", "metadata", "shipping_address"];
  const update: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) update[field] = body[field];
  }

  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .eq("site_id", siteId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
