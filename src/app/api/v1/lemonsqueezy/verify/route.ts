import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

const log = logger.child({ module: "lemonsqueezy-verify" });

function variantIdToTier(variantId: number | string): "pro" | "business" | "free" {
  const id = String(variantId);
  if (
    id === process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_MONTHLY ||
    id === process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO_ANNUAL
  ) return "pro";
  if (
    id === process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BUSINESS_MONTHLY ||
    id === process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BUSINESS_ANNUAL
  ) return "business";
  return "free";
}

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
  if (!LS_API_KEY) {
    return NextResponse.json({ plan: "free", verified: false });
  }

  const email = user.email ?? "";
  if (!email) return NextResponse.json({ error: "No email on account" }, { status: 400 });

  try {
    const { lemonSqueezySetup, listSubscriptions } = await import("@lemonsqueezy/lemonsqueezy.js");
    lemonSqueezySetup({ apiKey: LS_API_KEY });

    const { data: result } = await listSubscriptions({
      filter: { userEmail: email },
    });

    const active = result?.data?.find(
      (s) => s.attributes.status === "active" || s.attributes.status === "past_due"
    );

    if (!active) {
      log.info({ userId: user.id }, "No active subscription found during verify");
      return NextResponse.json({ plan: "free", verified: false });
    }

    const plan = variantIdToTier(active.attributes.variant_id);
    const subscriptionId = active.id;
    const customerId = String(active.attributes.customer_id);

    const { error } = await supabase
      .from("users")
      .update({ plan, ls_customer_id: customerId, stripe_subscription_id: subscriptionId })
      .eq("id", user.id);

    if (error) {
      log.error({ error, userId: user.id }, "Failed to update plan during verify");
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
    }

    log.info({ userId: user.id, plan, subscriptionId }, "Plan verified and updated");
    return NextResponse.json({ plan, verified: true });
  } catch (err) {
    log.error({ err }, "Lemon Squeezy verify error");
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
