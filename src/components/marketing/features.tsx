"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MousePointerClick,
  Sparkles,
  LayoutTemplate,
  Rocket,
  Code2,
  Users,
  Zap,
  Globe,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: MousePointerClick,
    title: "Drag & Drop Editor",
    description:
      "Intuitive visual editor with 100+ pre-built components. Build pixel-perfect layouts without touching code.",
    gradient: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500/10",
  },
  {
    icon: Sparkles,
    title: "AI Site Generator",
    description:
      "Describe your website in plain English and our AI will generate a complete, ready-to-launch site in seconds.",
    gradient: "from-primary-500 to-purple-600",
    bgGlow: "bg-primary-500/10",
  },
  {
    icon: LayoutTemplate,
    title: "120+ Templates",
    description:
      "Start with professionally designed templates for SaaS, portfolios, e-commerce, blogs, and more.",
    gradient: "from-pink-500 to-rose-500",
    bgGlow: "bg-pink-500/10",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description:
      "Deploy to Vercel, Netlify, or our global CDN with a single click. Custom domains included on all plans.",
    gradient: "from-orange-500 to-amber-500",
    bgGlow: "bg-orange-500/10",
  },
  {
    icon: Code2,
    title: "Code Export",
    description:
      "Export clean, production-ready React or HTML code at any time. Your site, your rules.",
    gradient: "from-green-500 to-emerald-500",
    bgGlow: "bg-green-500/10",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Real-time collaboration with your team. Comment, review, and ship together seamlessly.",
    gradient: "from-violet-500 to-purple-600",
    bgGlow: "bg-violet-500/10",
  },
];

const stats = [
  { value: "10K+", label: "Active teams" },
  { value: "120+", label: "Templates" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 50ms", label: "Global latency" },
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-[#0F0F0F] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Everything you need to{" "}
            <span className="gradient-text">build faster</span>
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            From initial design to production deployment, BuildStack gives you all the tools
            to create exceptional websites without compromise.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>

              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-10 bg-[#0F0F0F] hover:bg-white/[0.02] transition-colors"
            >
              <span className="text-4xl font-bold text-white mb-2">{stat.value}</span>
              <span className="text-white/40 text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
