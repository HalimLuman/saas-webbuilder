"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-24 pb-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-600/6 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Announcement badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-sm text-gray-600 mb-8 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary-500" />
          <span>Introducing AI Site Generator</span>
          <span className="h-3.5 w-px bg-gray-300" />
          <span className="text-primary-500 font-medium">New</span>
          <ArrowRight className="h-3.5 w-3.5 text-primary-500" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-6"
        >
          Build stunning{" "}
          <span className="relative">
            <span className="gradient-text">websites</span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 10C50 4 100 2 150 2C200 2 250 4 298 10"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <br />
          <span className="text-gray-800">with AI</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl sm:text-2xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The world&apos;s most powerful drag-and-drop website builder.
          Design, build, and deploy in minutes — no code required.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="xl"
            className="bg-primary-500 text-white hover:bg-primary-600 font-semibold shadow-xl shadow-primary-500/20 min-w-[200px]"
            asChild
          >
            <Link href="/signup">
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="xl"
            variant="outline"
            className="min-w-[180px] group"
          >
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 group-hover:bg-gray-200 transition-colors">
              <Play className="h-3.5 w-3.5 text-gray-700 fill-gray-700 ml-0.5" />
            </div>
            Watch Demo
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-primary-500 to-purple-600"
                  style={{
                    background: `hsl(${i * 50 + 200}, 70%, 60%)`,
                  }}
                />
              ))}
            </div>
            <span>10,000+ teams building</span>
          </div>
          <div className="h-px w-6 sm:h-6 sm:w-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span>4.9/5 from 2,000+ reviews</span>
          </div>
          <div className="h-px w-6 sm:h-6 sm:w-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary-500" />
            <span>No credit card required</span>
          </div>
        </motion.div>

        {/* Hero Image / Editor Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-primary-500/10 rounded-2xl blur-2xl" />

          {/* Mock Editor UI */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-200/80 bg-[#1A1A1A]">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 h-12 bg-[#141414] border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-500/70" />
                </div>
                <div className="h-5 w-px bg-white/10" />
                <span className="text-white/40 text-xs">My Portfolio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
                  ● Live
                </div>
                <div className="px-3 py-1 rounded-md bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-medium">
                  Publish
                </div>
              </div>
            </div>

            {/* Editor body */}
            <div className="flex h-[400px]">
              {/* Left panel */}
              <div className="w-14 bg-[#141414] border-r border-white/5 flex flex-col items-center py-3 gap-3">
                {["▣", "⊞", "◈", "⌂"].map((icon, i) => (
                  <div
                    key={i}
                    className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm transition-colors ${i === 0
                        ? "bg-primary-500/20 text-primary-400"
                        : "text-white/20 hover:text-white/40 hover:bg-white/5"
                      }`}
                  >
                    {icon}
                  </div>
                ))}
              </div>

              {/* Elements sidebar */}
              <div className="w-48 bg-[#161616] border-r border-white/5 p-3">
                <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3 px-1">Elements</p>
                <div className="space-y-1">
                  {["Hero Section", "Feature Grid", "Testimonials", "Pricing", "CTA Banner", "Footer"].map((el) => (
                    <div
                      key={el}
                      className="px-3 py-2 rounded-lg text-white/50 text-xs hover:bg-white/5 hover:text-white/80 cursor-grab transition-colors flex items-center gap-2"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-400/60" />
                      {el}
                    </div>
                  ))}
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 bg-[#F8F9FA] overflow-hidden">
                {/* Canvas content preview */}
                <div className="h-full flex flex-col">
                  {/* Hero preview */}
                  <div className="flex-1 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex flex-col items-center justify-center p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                    <div className="relative text-center">
                      <div className="h-2.5 bg-white/60 rounded-full w-48 mx-auto mb-2" />
                      <div className="h-1.5 bg-white/30 rounded-full w-64 mx-auto mb-1" />
                      <div className="h-1.5 bg-white/30 rounded-full w-52 mx-auto mb-4" />
                      <div className="flex gap-2 justify-center">
                        <div className="h-7 w-20 rounded-lg bg-white/90" />
                        <div className="h-7 w-20 rounded-lg border border-white/40" />
                      </div>
                    </div>
                    {/* Selection indicator */}
                    <div className="absolute inset-2 border-2 border-primary-300/50 rounded-lg pointer-events-none">
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                        Hero Section
                      </div>
                    </div>
                  </div>
                  {/* Features preview */}
                  <div className="h-28 bg-white flex items-center justify-center gap-4 px-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 rounded-lg bg-gray-50 border border-gray-100 p-3">
                        <div className="h-4 w-4 rounded bg-primary-100 mb-2" />
                        <div className="h-1.5 bg-gray-200 rounded w-16 mb-1" />
                        <div className="h-1 bg-gray-100 rounded w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="w-56 bg-[#161616] border-l border-white/5 p-3">
                <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3 px-1">Properties</p>
                <div className="space-y-3">
                  <div>
                    <div className="text-white/30 text-xs mb-1.5 px-1">Background</div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                      <div className="h-4 w-4 rounded bg-gradient-to-r from-primary-500 to-purple-600" />
                      <span className="text-white/50 text-xs">Gradient</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-white/30 text-xs mb-1.5 px-1">Typography</div>
                    {["Font", "Size", "Weight"].map((prop) => (
                      <div key={prop} className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/3 transition-colors">
                        <span className="text-white/30 text-xs">{prop}</span>
                        <span className="text-white/50 text-xs">—</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
