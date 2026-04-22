// src/lib/email.ts
import { Resend } from "resend";
import logger from "./logger";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.EMAIL_FROM ?? "Webperia <noreply@buildstack.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendTeamInviteEmail(
  to: string,
  inviterName: string,
  role: string,
  inviteId: string
): Promise<void> {
  if (!resend) {
    logger.warn({ to, inviteId }, "RESEND_API_KEY not set — skipping invite email");
    return;
  }
  const acceptUrl = `${APP_URL}/invite/${inviteId}`;
  await resend.emails.send({
    from: FROM,
    to,
    subject: `${inviterName} invited you to join their team on Webperia`,
    html: `
      <h2>You've been invited!</h2>
      <p>${inviterName} has invited you to join their team as a <strong>${role}</strong>.</p>
      <p><a href="${acceptUrl}" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Accept Invitation</a></p>
      <p style="color:#888;font-size:12px;margin-top:24px;">This invitation expires in 7 days. If you didn't expect this, you can ignore this email.</p>
    `,
  });
}

export async function sendPaymentFailedEmail(
  to: string,
  name: string
): Promise<void> {
  if (!resend) {
    logger.warn({ to }, "RESEND_API_KEY not set — skipping payment failed email");
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Action required: Your Webperia payment failed",
    html: `
      <h2>Payment failed</h2>
      <p>Hi ${name},</p>
      <p>We couldn't process your latest payment. Please update your payment method to keep your subscription active.</p>
      <p><a href="${APP_URL}/dashboard/billing" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Update Payment Method</a></p>
    `,
  });
}

export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<void> {
  if (!resend) {
    logger.warn({ to }, "RESEND_API_KEY not set — skipping welcome email");
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to Webperia!",
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your account is ready. Start building your first site in minutes.</p>
      <p><a href="${APP_URL}/dashboard" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Go to Dashboard</a></p>
    `,
  });
}
