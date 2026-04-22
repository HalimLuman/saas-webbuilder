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
} from "lucide-react";

const features = [
  {
    icon: MousePointerClick,
    title: "Drag & Drop Editor",
    description:
      "Intuitive visual editor with 100+ pre-built components. Build pixel-perfect layouts without touching code.",
    gradient: "from-[#F00B51] to-[#FF527E]",
    bgGlow: "bg-primary-50",
  },
  {
    icon: Sparkles,
    title: "AI Site Generator",
    description:
      "Describe your website in plain English and our AI will generate a complete, ready-to-launch site in seconds.",
    gradient: "from-[#F00B51] to-[#730062]",
    bgGlow: "bg-primary-50",
  },
  {
    icon: LayoutTemplate,
    title: "120+ Templates",
    description:
      "Start with professionally designed templates for SaaS, portfolios, e-commerce, blogs, and more.",
    gradient: "from-[#F00B51] to-purple-600",
    bgGlow: "bg-primary-50",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description:
      "Deploy to Vercel, Netlify, or our global CDN with a single click. Custom domains included on all plans.",
    gradient: "from-[#730062] to-[#4A003F]",
    bgGlow: "bg-primary-50",
  },
  {
    icon: Code2,
    title: "Code Export",
    description:
      "Export clean, production-ready React or HTML code at any time. Your site, your rules.",
    gradient: "from-black to-gray-800",
    bgGlow: "bg-gray-100",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Real-time collaboration with your team. Comment, review, and ship together seamlessly.",
    gradient: "from-[#F00B51] to-[#730062]",
    bgGlow: "bg-primary-50",
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
    <section id="features" className="py-32 bg-gray-50 relative overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-primary-600 text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            Features
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6 leading-tight">
            Everything you need to{" "}
            <span className="gradient-text">build faster</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From initial design to production deployment, Webperia gives you all the tools
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
              className="group relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-default"
            >
              {/* Icon */}
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>

              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl ${feature.bgGlow} opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none`} />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-10 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-4xl font-bold text-black mb-2">{stat.value}</span>
              <span className="text-gray-500 text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
