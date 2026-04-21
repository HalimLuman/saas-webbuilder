import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

const log = logger.child({ module: "paddle-portal" });

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: "No Paddle customer found. Please subscribe first." },
      { status: 400 }
    );
  }

  const PADDLE_API_KEY = process.env.PADDLE_API_KEY ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!PADDLE_API_KEY) {
    return NextResponse.json({ url: `${appUrl}/dashboard/billing`, mock: true });
  }

  try {
    const { Paddle, Environment } = await import("@paddle/paddle-node-sdk");
    const paddle = new Paddle(PADDLE_API_KEY, {
      environment: process.env.NODE_ENV === "production" ? Environment.production : Environment.sandbox,
    });

    // Creates an authenticated customer portal session.
    // Pass an empty array to open the general overview (not a specific subscription).
    const session = await paddle.customerPortalSessions.create(
      profile.stripe_customer_id,
      []
    );

    log.info({ userId: user.id }, "Paddle customer portal session created");
    return NextResponse.json({ url: session.urls.general.overview });
  } catch (err) {
    log.error({ err, userId: user.id }, "Paddle portal error");
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
