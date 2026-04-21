import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const PADDLE_API_KEY = process.env.PADDLE_API_KEY;

  // No Paddle key or no customer yet — return DB plan only
  if (!PADDLE_API_KEY || !profile.stripe_customer_id) {
    return NextResponse.json({
      plan: profile.plan ?? "free",
      subscription: null,
      invoices: [],
      paymentMethod: null,
    });
  }

  try {
    const { Paddle, Environment } = await import("@paddle/paddle-node-sdk");
    const paddle = new Paddle(PADDLE_API_KEY, {
      environment: process.env.NODE_ENV === "production" ? Environment.production : Environment.sandbox,
    });

    // Fetch active subscriptions and recent transactions in parallel
    const [subsCollection, txCollection] = await Promise.all([
      paddle.subscriptions.list({ customerId: [profile.stripe_customer_id], perPage: 1 }),
      paddle.transactions.list({ customerId: [profile.stripe_customer_id], perPage: 12 }),
    ]);

    // Collections are async iterables — .data is private in the SDK
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sub: any = null;
    for await (const item of subsCollection) { sub = item; break; }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const txItems: any[] = [];
    for await (const item of txCollection) { txItems.push(item); }

    return NextResponse.json({
      plan: profile.plan ?? "free",
      subscription: sub
        ? {
            id: sub.id,
            status: sub.status,
            currentPeriodEnd: sub.currentBillingPeriod?.endsAt ?? null,
            cancelAtPeriodEnd: sub.scheduledChange?.action === "cancel",
          }
        : null,
      paymentMethod: null,
      invoices: txItems
        .filter((t) => t.status === "completed")
        .map((t) => ({
          id: t.id,
          date: new Date(t.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          description: t.details?.lineItems?.[0]?.description ?? "Subscription",
          amount: t.details?.totals?.total
            ? `$${(parseInt(t.details.totals.total, 10) / 100).toFixed(2)}`
            : "—",
          status: "paid",
          pdfUrl: t.invoice?.url ?? null,
        })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Paddle error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
