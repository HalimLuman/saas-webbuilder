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

  const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY;

  // No key or no subscription yet — return DB plan only
  if (!LS_API_KEY || !profile.stripe_subscription_id) {
    return NextResponse.json({
      plan: profile.plan ?? "free",
      subscription: null,
      invoices: [],
      paymentMethod: null,
    });
  }

  try {
    const { lemonSqueezySetup, getSubscription, listSubscriptionInvoices } = await import("@lemonsqueezy/lemonsqueezy.js");
    lemonSqueezySetup({ apiKey: LS_API_KEY });

    const [subRes, invoicesRes] = await Promise.all([
      getSubscription(profile.stripe_subscription_id),
      listSubscriptionInvoices({
        filter: { subscriptionId: Number(profile.stripe_subscription_id) },
        page: { size: 12 },
      }),
    ]);

    const sub = subRes.data?.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoices: any[] = invoicesRes.data?.data ?? [];

    return NextResponse.json({
      plan: profile.plan ?? "free",
      subscription: sub
        ? {
            id: sub.id,
            status: sub.attributes.status,
            currentPeriodEnd: sub.attributes.renews_at ?? null,
            cancelAtPeriodEnd: sub.attributes.cancelled,
          }
        : null,
      paymentMethod: null,
      invoices: invoices
        .filter((inv) => inv.attributes.status === "paid")
        .map((inv) => ({
          id: inv.id,
          date: new Date(inv.attributes.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          description: "Subscription",
          amount: inv.attributes.total != null
            ? `$${(inv.attributes.total / 100).toFixed(2)}`
            : "—",
          status: "paid",
          pdfUrl: inv.attributes.urls?.invoice_url ?? null,
        })),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lemon Squeezy error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
