import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendPaymentFailedEmail } from "@/lib/email";
import logger from "@/lib/logger";

const log = logger.child({ module: "lemonsqueezy-webhook" });

export const dynamic = "force-dynamic";

function planIdToTier(planId: string): "pro" | "business" | "free" {
  if (planId.startsWith("pro")) return "pro";
  if (planId.startsWith("business")) return "business";
  return "free";
}


function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? "";

  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, mock: true });
  }

  if (!verifySignature(rawBody, signature, WEBHOOK_SECRET)) {
    log.error("Lemon Squeezy webhook signature verification failed");
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const eventName = event.meta?.event_name as string;
  const customData = event.meta?.custom_data ?? {};
  const attrs = event.data?.attributes ?? {};

  try {
    switch (eventName) {
      // Fired when a subscription is created after checkout.
      // Primary event for provisioning access.
      case "subscription_created": {
        const userId = (customData.userId as string) ?? null;
        const planId = (customData.planId as string) ?? "";
        const plan = planIdToTier(planId);
        const subscriptionId = String(event.data?.id);
        const customerId = String(attrs.customer_id);

        const updatePayload = { plan, ls_customer_id: customerId, stripe_subscription_id: subscriptionId };

        const { error } = userId
          ? await admin.from("users").update(updatePayload).eq("id", userId)
          : await admin.from("users").update(updatePayload).eq("ls_customer_id", customerId);

        if (error) {
          log.error({ error, userId, customerId }, "Failed to provision subscription");
        } else {
          log.info({ userId, plan, subscriptionId }, "Subscription provisioned");
        }
        break;
      }

      // Fired when plan/variant changes (upgrade or downgrade).
      case "subscription_updated": {
        const subscriptionId = String(event.data?.id);
        const planId = (customData.planId as string) ?? "";
        const plan = planIdToTier(planId);

        if (plan !== "free") {
          const { error } = await admin
            .from("users")
            .update({ plan })
            .eq("stripe_subscription_id", subscriptionId);

          if (error) {
            log.error({ error, subscriptionId }, "Failed to update subscription plan");
          } else {
            log.info({ subscriptionId, plan }, "Subscription updated");
          }
        }
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        const subscriptionId = String(event.data?.id);

        const { error } = await admin
          .from("users")
          .update({ plan: "free" })
          .eq("stripe_subscription_id", subscriptionId);

        if (error) {
          log.error({ error, subscriptionId }, "Failed to downgrade subscription");
        } else {
          log.info({ subscriptionId }, "Subscription cancelled — downgraded to free");
        }
        break;
      }

      // Fired when a subscription payment fails (dunning).
      case "subscription_payment_failed": {
        const customerId = String(attrs.customer_id);

        const { data: userRow } = await admin
          .from("users")
          .select("name, email")
          .eq("ls_customer_id", customerId)
          .single();

        const email = userRow?.email ?? "";
        const name = userRow?.name ?? "there";

        if (email) {
          await sendPaymentFailedEmail(email, name);
        }
        log.warn({ customerId, email }, "Payment failed — dunning email sent");
        break;
      }

      default:
        log.debug({ eventName }, "Unhandled Lemon Squeezy event");
    }
  } catch (err) {
    log.error({ err, eventName }, "Error processing Lemon Squeezy webhook event");
    // Return 200 so Lemon Squeezy doesn't retry — log and investigate separately
    return NextResponse.json({ received: true, error: "Handler error" });
  }

  return NextResponse.json({ received: true, eventName });
}
