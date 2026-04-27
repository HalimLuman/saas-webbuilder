import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

const log = logger.child({ module: "lemonsqueezy-portal" });

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_subscription_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_subscription_id) {
    return NextResponse.json(
      { error: "No active subscription found. Please subscribe first." },
      { status: 400 }
    );
  }

  const LS_API_KEY = process.env.LEMONSQUEEZY_API_KEY ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!LS_API_KEY) {
    return NextResponse.json({ url: `${appUrl}/dashboard/billing`, mock: true });
  }

  try {
    const { lemonSqueezySetup, getSubscription } = await import("@lemonsqueezy/lemonsqueezy.js");
    lemonSqueezySetup({ apiKey: LS_API_KEY });

    const { data: sub, error } = await getSubscription(profile.stripe_subscription_id);

    if (error) throw error;

    const portalUrl = sub?.data?.attributes?.urls?.customer_portal;
    if (!portalUrl) {
      return NextResponse.json({ error: "Customer portal not available" }, { status: 400 });
    }

    log.info({ userId: user.id }, "Lemon Squeezy customer portal URL retrieved");
    return NextResponse.json({ url: portalUrl });
  } catch (err) {
    log.error({ err, userId: user.id }, "Lemon Squeezy portal error");
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
