import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

const log = logger.child({ module: "paddle-checkout" });

function getPriceId(planId: string): string | null {
  const map: Record<string, string | undefined> = {
    pro_monthly:      process.env.PADDLE_PRICE_PRO_MONTHLY,
    pro_annual:       process.env.PADDLE_PRICE_PRO_ANNUAL,
    business_monthly: process.env.PADDLE_PRICE_BUSINESS_MONTHLY,
    business_annual:  process.env.PADDLE_PRICE_BUSINESS_ANNUAL,
  };
  return map[planId] ?? null;
}

function planIdToTier(planId: string): "pro" | "business" | "free" {
  if (planId.startsWith("pro")) return "pro";
  if (planId.startsWith("business")) return "business";
  return "free";
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("plan, stripe_customer_id, email, name")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { planId } = await req.json();
  if (!planId) return NextResponse.json({ error: "planId is required" }, { status: 400 });

  const PADDLE_API_KEY = process.env.PADDLE_API_KEY ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!PADDLE_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Payment service is not configured" }, { status: 503 });
    }
    return NextResponse.json({
      url: `${appUrl}/dashboard/billing?mock_checkout=true`,
      mock: true,
      message: "Add PADDLE_API_KEY + PADDLE_PRICE_* env vars to enable real payments",
    });
  }

  const priceId = getPriceId(planId);
  if (!priceId) {
    log.error({ planId }, "No Paddle price ID configured for plan");
    return NextResponse.json(
      { error: `No price configured for plan "${planId}". Set PADDLE_PRICE_${planId.toUpperCase()} in env.` },
      { status: 400 }
    );
  }

  try {
    const { Paddle, Environment } = await import("@paddle/paddle-node-sdk");
    const paddle = new Paddle(PADDLE_API_KEY, {
      environment: process.env.NODE_ENV === "production" ? Environment.production : Environment.sandbox,
    });

    // Reuse existing Paddle customer or create one
    let customerId: string = profile.stripe_customer_id ?? "";
    if (!customerId) {
      const customer = await paddle.customers.create({
        email: profile.email ?? user.email ?? "",
        name: profile.name ?? undefined,
      });
      customerId = customer.id;
      await supabase.from("users").update({ stripe_customer_id: customerId }).eq("id", user.id);
    }

    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      customerId,
      customData: { userId: user.id, planId, tier: planIdToTier(planId) },
      checkout: { url: `${appUrl}/dashboard/billing?success=true` },
    });

    log.info({ userId: user.id, planId, transactionId: transaction.id }, "Paddle checkout created");
    return NextResponse.json({ url: transaction.checkout?.url });
  } catch (err) {
    log.error({ err, userId: user.id, planId }, "Paddle checkout error");
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
