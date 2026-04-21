"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useSiteStore } from "@/store/site-store";
import {
  BarChart2, TrendingUp, Users, Eye, Clock, Globe,
  MousePointer, ArrowUpRight, ArrowDownRight, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Range = "7d" | "30d" | "90d";

// ---------------------------------------------------------------------------
// Fake data generator — replace with real analytics API
// ---------------------------------------------------------------------------

function generateSparkline(points: number, base: number, variance: number) {
  return Array.from({ length: points }, (_, i) => ({
    day: i,
    value: Math.max(0, Math.round(base + (Math.random() - 0.5) * variance * 2)),
  }));
}

function Sparkline({ data, color = "#6366F1" }: { data: { value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 80;
  const h = 28;
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * w},${h - (d.value / max) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({
  label, value, change, icon: Icon, color, sparkData,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  sparkData: { value: number }[];
}) {
  const up = change >= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>
        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className={cn("flex items-center gap-1 text-xs font-medium", up ? "text-emerald-600" : "text-red-500")}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(change)}% vs last period
        </div>
        <Sparkline data={sparkData} color={up ? "#10B981" : "#EF4444"} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

const TOP_PAGES = [
  { path: "/", title: "Home", views: 4821, bounce: "42%", time: "2m 14s" },
  { path: "/pricing", title: "Pricing", views: 2104, bounce: "38%", time: "3m 02s" },
  { path: "/about", title: "About", views: 1347, bounce: "55%", time: "1m 44s" },
  { path: "/blog", title: "Blog", views: 892, bounce: "61%", time: "4m 11s" },
  { path: "/contact", title: "Contact", views: 514, bounce: "29%", time: "2m 58s" },
];

const TRAFFIC_SOURCES = [
  { source: "Organic Search", sessions: 5240, pct: 48, color: "#6366F1" },
  { source: "Direct", sessions: 2180, pct: 20, color: "#8B5CF6" },
  { source: "Social Media", sessions: 1635, pct: 15, color: "#EC4899" },
  { source: "Referral", sessions: 1090, pct: 10, color: "#F59E0B" },
  { source: "Email", sessions: 763, pct: 7, color: "#10B981" },
];

const DEVICES = [
  { device: "Desktop", pct: 54, color: "#6366F1" },
  { device: "Mobile", pct: 38, color: "#8B5CF6" },
  { device: "Tablet", pct: 8, color: "#EC4899" },
];

// ---------------------------------------------------------------------------

export default function SiteAnalyticsPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const getSiteById = useSiteStore((s) => s.getSiteById);
  const site = getSiteById(siteId);
  const [range, setRange] = useState<Range>("30d");

  const spark7 = generateSparkline(7, 300, 80);
  const spark30 = generateSparkline(30, 350, 100);
  const sparkData = range === "7d" ? spark7 : spark30;

  const stats = [
    { label: "Total Visitors", value: range === "7d" ? "2,841" : "10,924", change: 12.4, icon: Users, color: "bg-indigo-50 text-indigo-600", sparkData },
    { label: "Page Views", value: range === "7d" ? "8,230" : "32,451", change: 8.7, icon: Eye, color: "bg-purple-50 text-purple-600", sparkData: generateSparkline(sparkData.length, 900, 200) },
    { label: "Avg. Session", value: "2m 38s", change: -3.1, icon: Clock, color: "bg-pink-50 text-pink-600", sparkData: generateSparkline(sparkData.length, 150, 40) },
    { label: "Bounce Rate", value: "44.2%", change: -1.8, icon: MousePointer, color: "bg-amber-50 text-amber-600", sparkData: generateSparkline(sparkData.length, 44, 6) },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-indigo-500" />
              Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{site?.name || siteId}</p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {(["7d", "30d", "90d"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  range === r ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {r === "7d" ? "7 days" : r === "30d" ? "30 days" : "90 days"}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Pages */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Top Pages
              </h2>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Page</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Views</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Bounce</th>
                  <th className="text-right px-5 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TOP_PAGES.map((p) => (
                  <tr key={p.path} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-800">{p.title}</div>
                      <div className="text-[10px] text-gray-400">{p.path}</div>
                    </td>
                    <td className="text-right px-4 py-3 font-semibold text-gray-700" suppressHydrationWarning>{p.views.toLocaleString()}</td>
                    <td className="text-right px-4 py-3 text-gray-500 hidden sm:table-cell">{p.bounce}</td>
                    <td className="text-right px-5 py-3 text-gray-500 hidden sm:table-cell">{p.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                Traffic Sources
              </h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              {TRAFFIC_SOURCES.map((s) => (
                <div key={s.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700 font-medium">{s.source}</span>
                    <span className="text-xs text-gray-500" suppressHydrationWarning>{s.sessions.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Devices */}
            <div className="px-5 pb-5 pt-1 border-t border-gray-50">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Devices</p>
              <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
                {DEVICES.map((d) => (
                  <div key={d.device} style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {DEVICES.map((d) => (
                  <div key={d.device} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.device} <span className="text-gray-400">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time note */}
        <p className="text-[11px] text-gray-400 text-center">
          Analytics data is illustrative. Connect a real analytics provider (e.g. Plausible, PostHog) to see live data.
        </p>
      </div>
    </div>
  );
}
