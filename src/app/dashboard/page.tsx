"use client";

import { motion } from "framer-motion";
import {
  Globe,
  BarChart2,
  Zap,
  CheckCircle2,
  TrendingUp,
  Plus,
  LayoutTemplate,
  Link2,
  ExternalLink,
  Pencil,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState, useCallback } from "react";

const PLAN_SITE_LIMITS: Record<string, number> = {
  free: 2, pro: 10, business: 999, enterprise: 999,
};

const quickActions = [
  { label: "New Site", icon: Plus, href: "/dashboard/sites/new", accent: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
  { label: "AI Generate", icon: Sparkles, href: "/dashboard/generate", accent: "bg-violet-50 text-violet-600 hover:bg-violet-100" },
  { label: "Browse Templates", icon: LayoutTemplate, href: "/templates", accent: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
  { label: "Connect Domain", icon: Link2, href: "/dashboard/domains", accent: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: "easeOut" },
  }),
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  sub?: string;
  index: number;
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  trend,
  trendUp,
  sub,
  index,
}: StatCardProps) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5",
              trendUp
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            )}
          >
            <TrendingUp className={cn("h-3 w-3", !trendUp && "rotate-180")} />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-0.5">{title}</p>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-pink-500 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-teal-500 to-cyan-600",
  "from-blue-500 to-sky-600",
  "from-green-500 to-emerald-600",
];

function siteGradient(id: string) {
  return GRADIENTS[id.charCodeAt(id.length - 1) % GRADIENTS.length];
}

export default function DashboardPage() {
  const wfetch = useWorkspaceFetch();
  const { activeWorkspaceId } = useWorkspaceStore();
  const { profile, user } = useUser();

  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!activeWorkspaceId) return;
    setLoading(true);
    try {
      const res = await wfetch("/api/v1/sites");
      const json = await res.json();
      setSites(json.data ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [wfetch, activeWorkspaceId]);

  useEffect(() => { load(); }, [load]);

  const recentSitesFromStore = sites.slice(0, 3);
  const firstName = profile?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";
  const aiUsed = profile?.ai_credits_used ?? 0;
  const aiLimit = profile?.ai_credits_limit ?? 0;
  const siteLimit = PLAN_SITE_LIMITS[profile?.plan ?? "free"] ?? 2;
  const activeSiteCount = sites.filter((s) => s.status !== "archived").length;
  const atLimit = !loading && activeSiteCount >= siteLimit;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {firstName}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {sites.length === 0
              ? "Get started by creating your first site."
              : "Here's an overview of your sites."}
          </p>
        </div>
        {atLimit ? (
          <Button variant="outline" asChild>
            <Link href="/dashboard/billing" className="text-amber-600 border-amber-200 hover:bg-amber-50">
              <ArrowRight className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard/sites/new">
              <Plus className="mr-2 h-4 w-4" />
              New Site
            </Link>
          </Button>
        )}
      </motion.div>

      {/* ── Stats Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          index={0}
          icon={Globe}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          title="Total Sites"
          value={String(sites.length)}
          sub={sites.length === 0 ? "Create your first site" : "across all workspaces"}
        />
        <StatCard
          index={1}
          icon={BarChart2}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          title="Total Pageviews"
          value="—"
          sub="Connect analytics to track"
        />
        <StatCard
          index={2}
          icon={Zap}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          title="AI Credits Used"
          value={`${aiUsed} / ${aiLimit}`}
          sub={`${profile?.plan ?? "free"} plan`}
        />
        <StatCard
          index={3}
          icon={CheckCircle2}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          title="Published Sites"
          value={String(sites.filter((s) => s.status === "published").length)}
          sub={`${sites.filter((s) => s.status === "draft").length} draft`}
        />
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-3"
      >
        {quickActions.map(({ label, icon: Icon, href, accent }) => {
          const resolvedHref = label === "New Site" && atLimit ? "/dashboard/billing" : href;
          return (
            <Link key={label} href={resolvedHref}>
              <button
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  label === "New Site" && atLimit ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : accent
                )}
              >
                <Icon className="h-4 w-4" />
                {label === "New Site" && atLimit ? "Upgrade Plan" : label}
              </button>
            </Link>
          );
        })}
      </motion.div>

      {/* ── Getting Started / Analytics placeholder ────────────────────── */}
      {sites.length === 0 && (
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center"
        >
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Globe className="h-7 w-7 text-indigo-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Create your first site</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Build a beautiful website in minutes. Start from a template or let AI generate one for you.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button asChild>
              <Link href={atLimit ? "/dashboard/billing" : "/dashboard/sites/new"}>
                <Plus className="mr-2 h-4 w-4" />
                {atLimit ? "Upgrade Plan" : "New Site"}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/generate">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Generate
              </Link>
            </Button>
          </div>
        </motion.div>
      )}

      {/* ── Recent Sites ───────────────────────────────────────────────── */}
      {recentSitesFromStore.length > 0 && (
        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Sites</h2>
            <Link
              href="/dashboard/sites"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View all sites
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentSitesFromStore.map((site, i) => (
              <motion.div
                key={site.id}
                custom={8 + i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
              >
                {/* Thumbnail placeholder */}
                <div className={cn("h-36 bg-gradient-to-br flex items-center justify-center", siteGradient(site.id))}>
                  <Globe className="h-10 w-10 text-white/60" />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug">{site.name}</h3>
                    <Badge variant={site.status === "published" ? "published" : "draft"} className="flex-shrink-0">
                      {site.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mb-4 truncate">
                    {site.customDomain ?? site.domain ?? "No domain"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
                      <Link href={`/editor/${site.id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    {site.status === "published" ? (
                      <Button variant="secondary" size="sm" className="flex-1 gap-1.5" asChild>
                        <a href={`https://${site.customDomain ?? site.domain}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Visit
                        </a>
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" className="flex-1 gap-1.5" disabled>
                        <ExternalLink className="h-3.5 w-3.5" />
                        Visit
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
}
