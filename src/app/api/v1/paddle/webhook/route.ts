import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { sendPaymentFailedEmail } from "@/lib/email";
import logger from "@/lib/logger";

const log = logger.child({ module: "paddle-webhook" });

export const dynamic = "force-dynamic";

function planIdToTier(planId: string): "pro" | "business" | "free" {
  if (planId.startsWith("pro")) return "pro";
  if (planId.startsWith("business")) return "business";
  return "free";
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("paddle-signature") ?? "";

  const PADDLE_API_KEY = process.env.PADDLE_API_KEY ?? "";
  const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET ?? "";

  if (!PADDLE_API_KEY || !WEBHOOK_SECRET) {
    return NextResponse.json({ received: true, mock: true });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;
  try {
    const { Paddle, Environment } = await import("@paddle/paddle-node-sdk");
    const paddle = new Paddle(PADDLE_API_KEY, {
      environment: process.env.NODE_ENV === "production" ? Environment.production : Environment.sandbox,
    });
    event = await paddle.webhooks.unmarshal(rawBody, WEBHOOK_SECRET, signature);
  } catch (err) {
    log.error({ err }, "Paddle webhook signature verification failed");
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const data = event.data ?? {};

  try {
    switch (event.eventType) {
      // Fired when a checkout is completed and payment is confirmed.
      // This is the primary event for provisioning access.
      case "transaction.completed": {
        const customerId = data.customerId as string;
        const subscriptionId = (data.subscriptionId as string | null) ?? null;
        const userId = (data.customData?.userId as string) ?? null;
        const planId = (data.customData?.planId as string) ?? "";
        const plan = planIdToTier(planId);

        const updatePayload: Record<string, string | null> = {
          plan,
          stripe_customer_id: customerId,
          ...(subscriptionId ? { stripe_subscription_id: subscriptionId } : {}),
        };

        const { error } = userId
          ? await admin.from("users").update(updatePayload).eq("id", userId)
          : await admin.from("users").update(updatePayload).eq("stripe_customer_id", customerId);

        if (error) {
          log.error({ error, customerId, userId }, "Failed to provision subscription");
        } else {
          log.info({ customerId, userId, plan, subscriptionId }, "Subscription provisioned");
        }
        break;
      }

      // Fired when a subscription's plan or status changes (e.g. upgrade/downgrade).
      case "subscription.updated": {
        const customerId = data.customerId as string;
        const planId = (data.customData?.planId as string) ?? "";
        const plan = planIdToTier(planId);

        if (plan !== "free") {
          const { error } = await admin
            .from("users")
            .update({ plan })
            .eq("stripe_customer_id", customerId);

          if (error) {
            log.error({ error, customerId }, "Failed to update subscription plan");
          } else {
            log.info({ customerId, plan }, "Subscription updated");
          }
        }
        break;
      }

      // Fired when a subscription is cancelled (immediately or at period end).
      case "subscription.canceled": {
        const customerId = data.customerId as string;

        const { error } = await admin
          .from("users")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId);

        if (error) {
          log.error({ error, customerId }, "Failed to downgrade subscription");
        } else {
          log.info({ customerId }, "Subscription cancelled — downgraded to free");
        }
        break;
      }

      // Fired when a payment attempt fails (dunning).
      case "transaction.payment_failed": {
        const customerId = data.customerId as string;

        const { data: userRow } = await admin
          .from("users")
          .select("name, email")
          .eq("stripe_customer_id", customerId)
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
        log.debug({ eventType: event.eventType }, "Unhandled Paddle event");
    }
  } catch (err) {
    log.error({ err, eventType: event?.eventType }, "Error processing Paddle webhook event");
    // Return 200 so Paddle doesn't retry — log and investigate separately
    return NextResponse.json({ received: true, error: "Handler error" });
  }

  return NextResponse.json({ received: true, eventType: event.eventType });
}
