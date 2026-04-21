"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const previewPlans = [
  {
    name: "Free",
    price: 0,
    description: "Get started with no commitment",
    features: ["2 websites", "1 published site", "Free templates", "BuildStack subdomain"],
    cta: "Start Free",
    href: "/signup",
    variant: "outline-dark" as const,
  },
  {
    name: "Pro",
    price: 5,
    description: "For freelancers and side projects",
    features: [
      "10 websites",
      "10 published sites",
      "50 AI credits/month",
      "Custom domain",
      "Analytics",
      "Code export",
    ],
    cta: "Start Pro",
    href: "/signup?plan=pro",
    variant: "default" as const,
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: 15,
    description: "For teams & agencies",
    features: [
      "Unlimited websites",
      "Unlimited publishing",
      "500 AI credits/month",
      "Team collaboration",
      "White-label",
      "24/7 support",
    ],
    cta: "Start Business",
    href: "/signup?plan=business",
    variant: "outline-dark" as const,
  },
];

export default function PricingPreview() {
  return (
    <section className="py-32 bg-[#0F0F0F] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            Simple Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Start free, scale as you grow
          </h2>
          <p className="text-xl text-white/50 max-w-xl mx-auto">
            No hidden fees. Cancel anytime. 20% discount on annual plans.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {previewPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border transition-all ${
                plan.highlighted
                  ? "bg-primary-500/10 border-primary-500/30 shadow-2xl shadow-primary-500/20"
                  : "bg-white/[0.02] border-white/[0.06]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-white/40 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-white/40">/mo</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-white/60">
                    <Check className="h-4 w-4 text-primary-400 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "default" : "outline-dark"}
                className={`w-full ${plan.highlighted ? "bg-primary-500 hover:bg-primary-600" : ""}`}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="ghost-dark" asChild>
            <Link href="/pricing" className="text-white/50 hover:text-white">
              View full pricing & comparison
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
