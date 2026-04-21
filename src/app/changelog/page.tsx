import React from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Sparkles, Wrench, Rocket, Shield, Zap as ZapIcon } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog — BuildStack",
  description: "See what's new in BuildStack. Latest features, improvements, and bug fixes.",
};

type ChangeType = "feature" | "improvement" | "fix" | "security" | "performance";

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  highlight?: string;
  changes: Change[];
}

const TYPE_CONFIG: Record<ChangeType, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  feature:     { label: "New",         color: "text-indigo-300", bg: "bg-indigo-500/20 border-indigo-500/30", icon: Sparkles },
  improvement: { label: "Improved",    color: "text-blue-300",   bg: "bg-blue-500/20 border-blue-500/30",     icon: Wrench },
  fix:         { label: "Fixed",       color: "text-emerald-300",bg: "bg-emerald-500/20 border-emerald-500/30",icon: Wrench },
  security:    { label: "Security",    color: "text-amber-300",  bg: "bg-amber-500/20 border-amber-500/30",   icon: Shield },
  performance: { label: "Performance", color: "text-rose-300",   bg: "bg-rose-500/20 border-rose-500/30",     icon: ZapIcon },
};

const RELEASES: Release[] = [
  {
    version: "2.8.0",
    date: "March 12, 2026",
    highlight: "AI Site Generator",
    changes: [
      { type: "feature", text: "AI Site Generator — describe your website in plain English and get a complete site in 30 seconds" },
      { type: "feature", text: "Style selector (Modern, Bold, Dark, Playful) and color palette picker for AI generation" },
      { type: "feature", text: "AI Copilot in editor — ask questions and make edits with natural language commands" },
      { type: "improvement", text: "Editor canvas now shows dotted grid background similar to Figma" },
      { type: "improvement", text: "Elements panel reorganized into 8 categories with search" },
      { type: "fix", text: "Fixed mobile layout issues on the editor canvas at viewport widths under 768px" },
      { type: "performance", text: "Canvas rendering is 40% faster due to element virtualization" },
    ],
  },
  {
    version: "2.7.0",
    date: "February 28, 2026",
    highlight: "Domains & Custom SSL",
    changes: [
      { type: "feature", text: "Custom domain management — connect and verify your own domains directly from the dashboard" },
      { type: "feature", text: "Automatic SSL provisioning via Let's Encrypt for all connected custom domains" },
      { type: "feature", text: "DNS record guide with copy-to-clipboard support for A and CNAME records" },
      { type: "improvement", text: "Dashboard notification center with unread count badge on the bell icon" },
      { type: "improvement", text: "Sidebar navigation now includes Domains and AI Generate shortcuts" },
      { type: "fix", text: "Fixed an issue where 'New Site' button linked to the wrong URL" },
    ],
  },
  {
    version: "2.6.0",
    date: "February 20, 2026",
    highlight: "CMS API GA",
    changes: [
      { type: "feature", text: "CMS API is now generally available for all Business plan users" },
      { type: "feature", text: "Full CRUD operations on all content collections via REST API" },
      { type: "feature", text: "Webhook support for create, update, and delete events on CMS items" },
      { type: "feature", text: "API key management in Dashboard → Settings → API Keys" },
      { type: "security", text: "API keys are now hashed at rest and only shown once on creation" },
      { type: "improvement", text: "CMS editor now supports rich text fields with inline formatting" },
    ],
  },
  {
    version: "2.5.0",
    date: "February 8, 2026",
    highlight: "Templates Library",
    changes: [
      { type: "feature", text: "300+ new templates across 10 categories including SaaS, Portfolio, E-commerce, and more" },
      { type: "feature", text: "Template preview modal with gradient mockup before applying" },
      { type: "feature", text: "Filter templates by category and pricing tier (Free/Pro/Business)" },
      { type: "improvement", text: "Site creation wizard now supports 3 creation methods: Template, AI, or Blank" },
      { type: "improvement", text: "Subdomain preview updates in real-time as you type your site name" },
      { type: "fix", text: "Fixed template categories not filtering correctly on mobile" },
    ],
  },
  {
    version: "2.4.0",
    date: "January 22, 2026",
    highlight: "Stripe Integration",
    changes: [
      { type: "feature", text: "Stripe Checkout integration — upgrade to Pro or Business plan directly from the dashboard" },
      { type: "feature", text: "Webhook handling for subscription lifecycle events (created, updated, deleted)" },
      { type: "feature", text: "Annual billing option with 20% discount" },
      { type: "improvement", text: "Billing page now shows current plan usage and limits" },
      { type: "security", text: "Stripe webhook signature verification to prevent spoofed events" },
    ],
  },
  {
    version: "2.3.0",
    date: "January 10, 2026",
    highlight: "Editor Overhaul",
    changes: [
      { type: "feature", text: "Properties Panel with 5 tabs: Layout, Style, Typography, Effects, and Interactions" },
      { type: "feature", text: "56 drag-and-drop elements across 8 categories" },
      { type: "feature", text: "Keyboard shortcuts: Ctrl+Z undo, Ctrl+Y redo, Ctrl+S save, Delete removes selected element" },
      { type: "feature", text: "Layers panel for visual element hierarchy and reordering" },
      { type: "improvement", text: "Drag overlay now shows element label when dragging from panel to canvas" },
      { type: "performance", text: "Editor initial load time reduced by 30%" },
    ],
  },
  {
    version: "2.2.0",
    date: "December 18, 2025",
    highlight: "Team Collaboration",
    changes: [
      { type: "feature", text: "Team member invitations via email with role-based access (Owner, Editor, Designer, Viewer)" },
      { type: "feature", text: "Activity feed showing all team actions on sites and content" },
      { type: "feature", text: "Workspace switcher in sidebar for managing multiple teams" },
      { type: "improvement", text: "Site cards now show collaborator avatars" },
      { type: "fix", text: "Fixed activity timestamps not showing correct timezone" },
    ],
  },
  {
    version: "2.1.0",
    date: "November 30, 2025",
    changes: [
      { type: "feature", text: "Analytics dashboard with 30-day visitor trends and traffic source breakdown" },
      { type: "feature", text: "Form submission inbox with expandable rows and recent entries" },
      { type: "improvement", text: "Asset manager now supports drag-and-drop upload and folder organization" },
      { type: "fix", text: "Fixed SSR hydration mismatch on the pricing page" },
      { type: "security", text: "Added Content-Security-Policy headers to all dashboard routes" },
    ],
  },
];

function fn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function ChangelogPage() {
  return (
    <div className="bg-[#0F0F0F] min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-medium mb-6">
            <Rocket className="h-3.5 w-3.5 text-indigo-400" />
            What&apos;s New
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Changelog
          </h1>
          <p className="text-xl text-white/50 max-w-lg">
            Every feature, improvement, and fix — documented as it ships.
          </p>
        </div>

        {/* Releases */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-0 w-px bg-white/10" />

          <div className="space-y-12">
            {RELEASES.map((release, idx) => (
              <div key={release.version} className="relative pl-10">
                {/* Timeline dot */}
                <div className={fn(
                  "absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 ring-4 ring-[#0F0F0F]",
                  idx === 0 ? "bg-indigo-500 border-indigo-400" : "bg-white/20 border-white/30"
                )} />

                {/* Version header */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-white font-bold text-lg">v{release.version}</span>
                  {release.highlight && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {release.highlight}
                    </span>
                  )}
                  <span className="text-white/30 text-sm ml-auto">{release.date}</span>
                </div>

                {/* Changes */}
                <ul className="space-y-2.5">
                  {release.changes.map((change, i) => {
                    const cfg = TYPE_CONFIG[change.type];
                    const Icon = cfg.icon;
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className={fn("inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border whitespace-nowrap shrink-0 mt-0.5", cfg.bg, cfg.color)}>
                          {change.type === "feature" && <Icon className="h-2.5 w-2.5" />}
                          {cfg.label}
                        </span>
                        <span className="text-white/60 text-sm leading-relaxed">{change.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 pt-12 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm mb-4">Want to know when new features ship?</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
          >
            Follow the blog for in-depth release notes
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
