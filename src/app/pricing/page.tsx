"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Zap, ArrowRight, HelpCircle } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with no commitment",
    badge: null,
    highlighted: false,
    features: {
      websites: "2 websites",
      publish: "1 published site",
      customDomain: false,
      ssl: true,
      analytics: false,
      team: false,
      aiGenerate: false,
      templates: "Free templates only",
      codeExport: false,
      whiteLabel: false,
      support: "Community support",
      sla: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 5,
    annualPrice: 4,
    description: "For freelancers and side projects",
    badge: "Most Popular",
    highlighted: true,
    features: {
      websites: "10 websites",
      publish: "10 published sites",
      customDomain: true,
      ssl: true,
      analytics: true,
      team: false,
      aiGenerate: "50 credits/month",
      templates: "All templates",
      codeExport: true,
      whiteLabel: false,
      support: "Priority email support",
      sla: false,
    },
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 15,
    annualPrice: 12,
    description: "For teams, agencies, and power users",
    badge: null,
    highlighted: false,
    features: {
      websites: "Unlimited websites",
      publish: "Unlimited publishing",
      customDomain: true,
      ssl: true,
      analytics: true,
      team: "Up to 10 members",
      aiGenerate: "500 credits/month",
      templates: "All templates + custom",
      codeExport: true,
      whiteLabel: true,
      support: "24/7 chat & email",
      sla: false,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "Custom solutions for large organizations",
    badge: null,
    highlighted: false,
    features: {
      websites: "Unlimited websites",
      publish: "Unlimited publishing",
      customDomain: true,
      ssl: true,
      analytics: true,
      team: "Unlimited members",
      aiGenerate: "Unlimited",
      templates: "All templates + custom",
      codeExport: true,
      whiteLabel: true,
      support: "Dedicated account manager",
      sla: true,
    },
  },
];

const comparisonFeatures = [
  { label: "Websites", key: "websites" },
  { label: "Publishing", key: "publish" },
  { label: "Custom Domain", key: "customDomain" },
  { label: "Free SSL", key: "ssl" },
  { label: "Analytics", key: "analytics" },
  { label: "Team Members", key: "team" },
  { label: "AI Generator", key: "aiGenerate" },
  { label: "Templates", key: "templates" },
  { label: "Code Export", key: "codeExport" },
  { label: "White Label", key: "whiteLabel" },
  { label: "Support", key: "support" },
  { label: "99.9% SLA", key: "sla" },
];

const faqs = [
  {
    question: "Can I try BuildStack for free?",
    answer: "Yes! Our Free plan gives you full access to the core features with no time limit. No credit card required to sign up.",
  },
  {
    question: "What happens when I reach my plan limits?",
    answer: "We'll notify you when you're approaching your limits. You can upgrade at any time to get more capacity. We won't automatically charge you or take your site offline.",
  },
  {
    question: "Can I switch plans at any time?",
    answer: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time. When upgrading, you'll be prorated for the remainder of your billing cycle.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! All paid plans come with a 20% discount when billed annually, which is equivalent to getting over 2 months free.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied for any reason, contact our support team for a full refund.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      <Navbar />

      <main className="pt-28 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5" />
              Transparent Pricing
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
              Simple, predictable pricing
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto mb-8">
              Start for free. Upgrade when you need more. Cancel anytime.
            </p>

            {/* Annual toggle */}
            <div className="flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!isAnnual ? "text-white" : "text-white/40"}`}>
                Monthly
              </span>
              <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
              <span className={`text-sm font-medium ${isAnnual ? "text-white" : "text-white/40"}`}>
                Annual
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                Save 20%
              </span>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlighted
                    ? "bg-primary-500/10 border-2 border-primary-500/40 shadow-2xl shadow-primary-500/20"
                    : "bg-white/[0.03] border border-white/[0.08]"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="pro" className="text-xs px-3 py-0.5">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-white/40 text-sm mb-4">{plan.description}</p>

                  {plan.monthlyPrice !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">
                        ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-white/40 text-sm">/mo</span>
                      {isAnnual && plan.monthlyPrice > 0 && (
                        <span className="text-white/30 text-sm line-through ml-1">
                          ${plan.monthlyPrice}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-white">Custom</div>
                  )}
                </div>

                {/* Key features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    plan.features.websites,
                    plan.features.publish,
                    plan.features.aiGenerate,
                    plan.features.templates,
                    plan.features.support,
                  ].map((feature) => (
                    <li key={String(feature)} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 mt-0.5 shrink-0 ${plan.highlighted ? "text-primary-400" : "text-white/40"}`} />
                      <span className="text-white/60">{String(feature)}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? "default" : "outline-dark"}
                  className={`w-full ${plan.highlighted ? "bg-primary-500 hover:bg-primary-600 shadow-lg shadow-primary-500/30" : ""}`}
                  asChild
                >
                  <Link href={plan.id === "enterprise" ? "#" : `/signup?plan=${plan.id}`}>
                    {plan.id === "enterprise" ? "Contact Sales" : `Get ${plan.name}`}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Full feature comparison
          </h2>
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-5 bg-white/[0.03]">
              <div className="p-4 text-white/40 text-sm font-medium">Feature</div>
              {plans.map((plan) => (
                <div key={plan.id} className={`p-4 text-center ${plan.highlighted ? "bg-primary-500/10" : ""}`}>
                  <span className={`text-sm font-semibold ${plan.highlighted ? "text-primary-400" : "text-white/80"}`}>
                    {plan.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Table rows */}
            {comparisonFeatures.map((feature, i) => (
              <div
                key={feature.key}
                className={`grid grid-cols-5 border-t border-white/[0.05] ${i % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"}`}
              >
                <div className="p-4 text-white/60 text-sm">{feature.label}</div>
                {plans.map((plan) => {
                  const value = plan.features[feature.key as keyof typeof plan.features];
                  return (
                    <div key={plan.id} className={`p-4 text-center ${plan.highlighted ? "bg-primary-500/5" : ""}`}>
                      {typeof value === "boolean" ? (
                        value ? (
                          <Check className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-white/20 mx-auto" />
                        )
                      ) : (
                        <span className="text-white/60 text-xs">{String(value)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/[0.08] overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-white/90 font-medium text-sm pr-4">{faq.question}</span>
                  <HelpCircle className={`h-5 w-5 shrink-0 transition-colors ${openFaq === index ? "text-primary-400" : "text-white/30"}`} />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-white/50 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start building for free today
          </h2>
          <p className="text-white/50 mb-8">
            No credit card required. Cancel anytime. 30-day money-back guarantee on paid plans.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-white/90 font-semibold" asChild>
            <Link href="/signup">
              Get started for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
