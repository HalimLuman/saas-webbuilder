"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CreditCard, Download, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

const PLAN_LIMITS: Record<string, { sites: number; publishedSites: number; aiCredits: number }> = {
  free:       { sites: 2,   publishedSites: 1,  aiCredits: 0 },
  pro:        { sites: 10,  publishedSites: 10, aiCredits: 50 },
  business:   { sites: 999, publishedSites: 999, aiCredits: 500 },
  enterprise: { sites: 999, publishedSites: 999, aiCredits: 99999 },
};

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: 5,
    features: ["10 websites", "1 published site", "50 AI credits/mo", "Custom domain", "Code export"],
    color: "border-indigo-200 bg-indigo-50",
    badge: null as string | null,
  },
  {
    id: "business",
    name: "Business",
    price: 15,
    features: ["Unlimited websites", "Unlimited publishing", "500 AI credits/mo", "Team collaboration", "White-label"],
    color: "border-purple-200",
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null as number | null,
    features: ["Unlimited everything", "SSO & SAML", "Audit logs", "Dedicated support", "Custom SLA"],
    color: "border-gray-200",
    badge: null as string | null,
  },
];

interface BillingData {
  plan: string;
  subscription: {
    id: string;
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
  paymentMethod: { brand: string; last4: string; expMonth: number; expYear: number } | null;
  invoices: { id: string; date: string; description: string; amount: string; status: string; pdfUrl: string | null }[];
}

function UsageBar({ label, used, total, color }: { label: string; used: number | string; total: number | string; color: string }) {
  const usedNum = typeof used === "number" ? used : parseFloat(used as string) || 0;
  const totalNum = typeof total === "number" ? total : parseFloat(total as string) || 1;
  const pct = Math.min((usedNum / totalNum) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-gray-700">{label}</span>
        <span className="text-xs text-gray-500" suppressHydrationWarning>{used.toLocaleString()} / {total.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

async function handleUpgrade(planId: string, annual: boolean) {
  const fullPlanId = `${planId}_${annual ? "annual" : "monthly"}`;
  try {
    const res = await fetch("/api/v1/paddle/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: fullPlanId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error(data.error ?? "Failed to start checkout");
    }
  } catch {
    toast.error("Network error. Please try again.");
  }
}

async function handleManageSubscription() {
  try {
    const res = await fetch("/api/v1/paddle/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error(data.error ?? "Failed to open billing portal");
    }
  } catch {
    toast.error("Network error. Please try again.");
  }
}

export default function BillingPage() {
  const [annual, setAnnual] = useState(false);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loadingBilling, setLoadingBilling] = useState(true);
  const searchParams = useSearchParams();
  const { profile } = useUser();

  const loadBilling = useCallback(async () => {
    setLoadingBilling(true);
    try {
      const res = await fetch("/api/v1/paddle/billing");
      const json = await res.json();
      if (!json.error) setBilling(json);
    } catch { /* ignore */ }
    finally { setLoadingBilling(false); }
  }, []);

  useEffect(() => { loadBilling(); }, [loadBilling]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated!", { description: "Your plan has been upgraded successfully." });
    }
    if (searchParams.get("mock_checkout") === "true") {
      toast.success("Mock checkout complete!", { description: "Add PADDLE_API_KEY to enable real payments." });
    }
  }, [searchParams]);

  const currentPlan = billing?.plan ?? profile?.plan ?? "free";
  const limits = PLAN_LIMITS[currentPlan] ?? PLAN_LIMITS.free;
  const renewDate = billing?.subscription?.currentPeriodEnd
    ? new Date(billing.subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your subscription, payment method, and invoices</p>
      </div>

      {/* Current plan card */}
      <div className="bg-white rounded-2xl border border-indigo-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 capitalize">{currentPlan} Plan</p>
                {renewDate && (
                  <p className="text-xs text-gray-500" suppressHydrationWarning>
                    {billing?.subscription?.cancelAtPeriodEnd ? "Cancels" : "Renews"} {renewDate}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleManageSubscription}>
            Manage Subscription
          </Button>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Usage This Month</h2>
        {currentPlan === "free" || limits.aiCredits === 0 ? (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            AI features are locked on the free plan.{" "}
            <Link href="/dashboard/billing#plans" className="font-semibold underline hover:no-underline">
              Upgrade your plan
            </Link>{" "}
            to unlock AI generation.
          </p>
        ) : (
          <div className="space-y-4">
            <UsageBar
              label="AI Credits"
              used={profile?.ai_credits_used ?? 0}
              total={limits.aiCredits}
              color="bg-purple-500"
            />
            <div className="pt-2 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Need more AI credits?{" "}
                <button className="text-indigo-600 hover:underline font-medium" onClick={() => toast.info("Upgrade your plan for more credits")}>
                  Upgrade your plan
                </button>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment method */}
      {billing?.paymentMethod && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-14 rounded-lg bg-gray-800 flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase">{billing.paymentMethod.brand}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">{billing.paymentMethod.brand} ending in {billing.paymentMethod.last4}</p>
                <p className="text-xs text-gray-400">Expires {billing.paymentMethod.expMonth}/{billing.paymentMethod.expYear}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleManageSubscription}>
              <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Update
            </Button>
          </div>
        </div>
      )}

      {/* Plan comparison */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Available Plans</h2>
          <div className="flex items-center gap-2 bg-gray-100 p-0.5 rounded-lg">
            {["monthly", "annual"].map((v) => (
              <button
                key={v}
                onClick={() => setAnnual(v === "annual")}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize",
                  (annual ? "annual" : "monthly") === v ? "bg-white shadow-sm text-gray-900" : "text-gray-500"
                )}
              >
                {v === "annual" ? "Annual (–20%)" : "Monthly"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div key={plan.id} className={`rounded-2xl border-2 p-5 ${isCurrent ? "border-indigo-200 bg-indigo-50" : plan.color} relative`}>
                {plan.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500 text-white whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gray-700 text-white whitespace-nowrap">
                    Current Plan
                  </span>
                )}
                <p className="font-bold text-gray-900 mb-1">{plan.name}</p>
                {plan.price ? (
                  <p className="text-2xl font-black text-gray-900 mb-3">
                    ${annual ? Math.round(plan.price * 0.8) : plan.price}
                    <span className="text-sm font-normal text-gray-400">/mo</span>
                  </p>
                ) : (
                  <p className="text-2xl font-black text-gray-900 mb-3">Custom</p>
                )}
                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <CheckCircle className="h-3 w-3 text-indigo-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button size="sm" className="w-full" disabled>Current Plan</Button>
                ) : (
                  <Button size="sm" className="w-full gap-1" onClick={() => handleUpgrade(plan.id, annual)}>
                    Upgrade <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice history */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Invoice History</h2>
        </div>
        {loadingBilling ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Loading invoices…</div>
        ) : (billing?.invoices ?? []).length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">No invoices yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left">
                {["Date", "Description", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-xs font-semibold text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(billing?.invoices ?? []).map((inv) => (
                <tr key={inv.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 text-sm text-gray-600">{inv.date}</td>
                  <td className="px-5 py-3 text-sm text-gray-800">{inv.description}</td>
                  <td className="px-5 py-3 text-sm font-medium text-gray-900">{inv.amount}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full capitalize">{inv.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {inv.pdfUrl ? (
                      <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 ml-auto">
                        <Download className="h-3 w-3" /> PDF
                      </a>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
