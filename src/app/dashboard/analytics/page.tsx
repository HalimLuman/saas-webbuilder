"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { useWorkspaceStore } from "@/store/workspace-store";
import {
  TrendingUp,
  Users,
  Clock,
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LineChart = dynamic(() => import("recharts").then((m) => ({ default: m.LineChart })), { ssr: false });
const Line = dynamic(() => import("recharts").then((m) => ({ default: m.Line })), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => ({ default: m.Tooltip })), { ssr: false });
const Legend = dynamic(() => import("recharts").then((m) => ({ default: m.Legend })), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => ({ default: m.ResponsiveContainer })), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((m) => ({ default: m.PieChart })), { ssr: false });
const Pie = dynamic(() => import("recharts").then((m) => ({ default: m.Pie })), { ssr: false });
const Cell = dynamic(() => import("recharts").then((m) => ({ default: m.Cell })), { ssr: false });

type DateRange = "7d" | "30d" | "90d";

interface DailyPoint { date: string; Pageviews: number; Visitors: number; }
interface TopPage { path: string; title: string; visitors: number; bounceRate: number; }
interface TopReferrer { source: string; label: string; visitors: number; }
interface AnalyticsData {
  summary: {
    visitors:    { value: number; change: number };
    pageViews:   { value: number; change: number };
    bounceRate:  { value: number; change: number };
    avgDuration: { value: number; change: number };
  };
  daily: { date: string; visitors: number; pageViews: number }[];
  topPages: TopPage[];
  topReferrers: TopReferrer[];
  devices: { desktop: number; mobile: number; tablet: number };
}

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#3b82f6", "#ec4899"];

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

const dateRanges: { label: string; value: DateRange }[] = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
];

// ─── Custom tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900" suppressHydrationWarning>
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Custom pie label ──────────────────────────────────────────────────────────
const renderCustomLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DATE_RANGES: { label: string; value: DateRange }[] = [
  { label: "Last 7 days",  value: "7d"  },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
];

export default function AnalyticsPage() {
  const wfetch = useWorkspaceFetch();
  const { activeWorkspaceId } = useWorkspaceStore();
  const [activeDateRange, setActiveDateRange] = useState<DateRange>("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (range: DateRange) => {
    setLoading(true);
    try {
      const res = await wfetch(`/api/v1/analytics?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [wfetch]);

  useEffect(() => { load(activeDateRange); }, [activeDateRange, load, activeWorkspaceId]);

  // Transform daily data for recharts
  const chartData: DailyPoint[] = (data?.daily ?? []).map((d) => ({
    date: d.date.slice(5), // show MM-DD
    Pageviews: d.pageViews,
    Visitors: d.visitors,
  }));

  // Referrers for pie chart
  const pieData = (data?.topReferrers ?? []).map((r, i) => ({
    name: r.label,
    value: r.visitors,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));
  const pieTotal = pieData.reduce((s, d) => s + d.value, 1);

  const summary = data?.summary;

  const metrics = [
    { label: "Pageviews",       value: loading ? "—" : (summary?.pageViews.value ?? 0).toLocaleString(),  change: summary?.pageViews.change ?? 0,  positive: (summary?.pageViews.change ?? 0) >= 0,  icon: TrendingUp,       iconColor: "text-indigo-600", iconBg: "bg-indigo-50",  border: "border-indigo-100"  },
    { label: "Unique Visitors", value: loading ? "—" : (summary?.visitors.value ?? 0).toLocaleString(),   change: summary?.visitors.change ?? 0,   positive: (summary?.visitors.change ?? 0) >= 0,  icon: Users,            iconColor: "text-blue-600",   iconBg: "bg-blue-50",    border: "border-blue-100"    },
    { label: "Avg. Session",    value: loading ? "—" : formatDuration(summary?.avgDuration.value ?? 0),   change: summary?.avgDuration.change ?? 0, positive: (summary?.avgDuration.change ?? 0) >= 0, icon: Clock,            iconColor: "text-green-600",  iconBg: "bg-green-50",   border: "border-green-100"   },
    { label: "Bounce Rate",     value: loading ? "—" : `${summary?.bounceRate.value ?? 0}%`,               change: summary?.bounceRate.change ?? 0, positive: (summary?.bounceRate.change ?? 0) <= 0, icon: MousePointerClick, iconColor: "text-orange-600", iconBg: "bg-orange-50",  border: "border-orange-100"  },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Track your website performance and visitor insights</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => load(activeDateRange)}
            disabled={loading}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {DATE_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setActiveDateRange(range.value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                  activeDateRange === range.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {metrics.map((metric) => (
          <div key={metric.label} className={cn("bg-white rounded-xl border p-5 flex flex-col gap-3", metric.border)}>
            <div className="flex items-center justify-between">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", metric.iconBg)}>
                <metric.icon className={cn("h-5 w-5", metric.iconColor)} />
              </div>
              {metric.change !== 0 && (
                <span className={cn("flex items-center gap-0.5 text-xs font-semibold", metric.positive ? "text-green-600" : "text-red-500")}>
                  {metric.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(metric.change).toFixed(1)}%
                </span>
              )}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900" suppressHydrationWarning>{metric.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{metric.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Line Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Traffic Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">Pageviews and unique visitors over time</p>
          </div>
        </div>
        {loading ? (
          <div className="h-[280px] flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-300" />
          </div>
        ) : chartData.length === 0 || chartData.every((d) => d.Pageviews === 0) ? (
          <div className="h-[280px] flex flex-col items-center justify-center text-gray-400">
            <TrendingUp className="h-10 w-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">No data yet</p>
            <p className="text-xs mt-1">Analytics will appear here once your sites receive visitors.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval={activeDateRange === "7d" ? 0 : 4} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={50} tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="Pageviews" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="Visitors"  stroke="#22c55e" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bottom Row: Referrers + Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Traffic Sources Donut */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Traffic Sources</h2>
          <p className="text-xs text-gray-500 mb-5">Where your visitors come from</p>

          {pieData.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-300 text-sm">No referrer data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" labelLine={false} label={renderCustomLabel}>
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} visits`, "Visitors"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2.5">
                {pieData.map((source) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: source.color }} />
                      <span className="text-sm text-gray-600">{source.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{Math.round((source.value / pieTotal) * 100)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Top Pages Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:col-span-3">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Top Pages</h2>
          <p className="text-xs text-gray-500 mb-5">Most visited pages this period</p>

          {(data?.topPages ?? []).length === 0 ? (
            <div className="py-10 text-center text-gray-300 text-sm">No page view data yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Page</th>
                    <th className="pb-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">Visitors</th>
                    <th className="pb-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Bounce</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(data?.topPages ?? []).map((page) => (
                    <tr key={page.path} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pr-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[160px]">{page.title}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{page.path}</p>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className="text-sm font-semibold text-gray-900" suppressHydrationWarning>{page.visitors.toLocaleString()}</span>
                      </td>
                      <td className="py-3 text-right hidden sm:table-cell">
                        <span className={cn("text-sm font-medium", page.bounceRate < 25 ? "text-green-600" : page.bounceRate > 38 ? "text-red-500" : "text-gray-600")}>
                          {page.bounceRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
