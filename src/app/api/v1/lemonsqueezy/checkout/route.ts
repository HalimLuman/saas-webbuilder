import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

const log = logger.child({ module: "lemonsqueezy-checkout" });

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("email, name")
    .eq("id", user.id)
    .maybeSingle();

  const { variantId, planId } = await req.json();
  if (!variantId) return NextResponse.json({ error: "variantId is required" }, { status: 400 });
  if (!planId) return NextResponse.json({ error: "planId is required" }, { status: 400 });

  const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY ?? "";
  const LS_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!LS_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Payment service is not configured" }, { status: 503 });
    }
    return NextResponse.json({
      url: `${appUrl}/dashboard/billing?mock_checkout=true`,
      mock: true,
      message: "Add LEMONSQUEEZY_API_KEY to enable real payments",
    });
  }

  try {
    const { lemonSqueezySetup, createCheckout } = await import("@lemonsqueezy/lemonsqueezy.js");
    lemonSqueezySetup({ apiKey: LS_API_KEY });

    const { data: checkout, error } = await createCheckout(LS_STORE_ID, variantId, {
      checkoutData: {
        email: profile?.email ?? user.email ?? "",
        name: profile?.name ?? (user.user_metadata?.full_name as string | undefined),
        custom: { userId: user.id, planId },
      },
      productOptions: {
        redirectUrl: `${appUrl}/dashboard/billing?success=true`,
        receiptButtonText: "Go to Billing",
      },
    });

    if (error) throw error;

    log.info({ userId: user.id, planId }, "Lemon Squeezy checkout created");
    return NextResponse.json({ url: checkout?.data?.attributes?.url });
  } catch (err) {
    log.error({ err, userId: user.id, planId }, "Lemon Squeezy checkout error");
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
