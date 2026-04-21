"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Rocket, CheckCircle2, Clock, Globe, XCircle, Loader2, ExternalLink } from "lucide-react";
import { useSiteStore } from "@/store/site-store";
import { useWorkspaceStore } from "@/store/workspace-store"; // getState() only — not a hook subscription
import { cn } from "@/lib/utils";

interface DbDeployment {
  id: string;
  site_id: string;
  status: "building" | "success" | "failed";
  url: string | null;
  vercel_deployment_id: string | null;
  created_at: string;
  finished_at: string | null;
  error_message: string | null;
}

const STATUS_CFG = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-green-600",
    bgClass: "bg-green-50 border-green-100",
    badge: "bg-green-50 text-green-700 border-green-200",
    label: "Published",
  },
  building: {
    icon: Loader2,
    iconClass: "text-blue-600 animate-spin",
    bgClass: "bg-blue-50 border-blue-100",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    label: "Building",
  },
  failed: {
    icon: XCircle,
    iconClass: "text-red-500",
    bgClass: "bg-red-50 border-red-100",
    badge: "bg-red-50 text-red-700 border-red-200",
    label: "Failed",
  },
};

function deploymentHostingLabel(d: DbDeployment) {
  if (d.vercel_deployment_id) return "Vercel";
  return "Built-in hosting";
}

/** Returns the best available detail message for a deployment row. */
function deployNote(d: DbDeployment): string | null {
  if (d.error_message) return d.error_message;
  if (d.status === "success" && !d.vercel_deployment_id)
    return "Published via built-in hosting. Connect Vercel to get an external URL.";
  if (d.status === "failed")
    return "Deployment failed. Check your Vercel project settings or server logs for details.";
  if (d.status === "building" && !d.vercel_deployment_id)
    return "Resolving — no external host is configured. Status will update shortly.";
  return null;
}

export default function DeploymentsPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const site = useSiteStore((s) => s.getSiteById(siteId));

  const [deployments, setDeployments] = useState<DbDeployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    // Read workspace ID imperatively — not as a reactive dep — to avoid
    // re-firing when the workspace store hydrates after mount.
    const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
    const headers: HeadersInit = {};
    if (workspaceId) headers["x-workspace-id"] = workspaceId;
    fetch(`/api/v1/sites/${siteId}/deployments`, { headers })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) throw new Error(json.error);
        setDeployments(json.data ?? []);
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [siteId]);

  if (!site) {
    return (
      <div className="p-8 text-center">
        <Rocket className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Site not found</p>
        <Link href="/dashboard/sites" className="text-sm text-indigo-600 hover:underline mt-2 inline-block">
          Back to My Sites
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/dashboard/sites/${siteId}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Site
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Rocket className="h-6 w-6 text-indigo-600" />
              Deployments
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              History of all deployments for <span className="font-medium text-gray-700">{site.name}</span>
            </p>
          </div>
          {site.status === "published" && (
            <Link
              href={`/published/${siteId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              View Published Site
              <ExternalLink className="h-3 w-3 opacity-70" />
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading deployments...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-red-700">Failed to load deployments</p>
          <p className="text-xs text-red-500 mt-1">{error}</p>
        </div>
      ) : deployments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Globe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-900 font-medium">No deployments yet</p>
          <p className="text-gray-500 text-sm mt-1 mb-4">
            Publish your site from the dashboard to create your first deployment.
          </p>
          <Link
            href={`/dashboard/sites/${siteId}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Go to Overview
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {deployments.map((deploy, i) => {
              const cfg = STATUS_CFG[deploy.status] ?? STATUS_CFG.building;
              const Icon = cfg.icon;
              const hosting = deploymentHostingLabel(deploy);
              const durationMs =
                deploy.finished_at && deploy.created_at
                  ? new Date(deploy.finished_at).getTime() - new Date(deploy.created_at).getTime()
                  : null;
              const durationSec = durationMs !== null ? Math.round(durationMs / 1000) : null;

              const note = deployNote(deploy);

              return (
                <div
                  key={deploy.id}
                  className="p-5 flex items-start justify-between flex-col sm:flex-row gap-4 hover:bg-gray-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn("h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border", cfg.bgClass)}>
                      <Icon className={cn("h-5 w-5", cfg.iconClass)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">
                          Production Deployment
                        </p>
                        {i === 0 && (
                          <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-full">
                            Latest
                          </span>
                        )}
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium border", cfg.badge)}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
                          {hosting}
                        </span>
                      </div>

                      {/* ID + timestamps */}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap font-mono">
                        <span>{deploy.id.slice(0, 8)}</span>
                        <span className="text-gray-200">·</span>
                        <span className="flex items-center gap-1 font-sans" suppressHydrationWarning>
                          <Clock className="h-3 w-3" />
                          {new Date(deploy.created_at).toLocaleString()}
                        </span>
                        {durationSec !== null && (
                          <>
                            <span className="text-gray-200">·</span>
                            <span className="font-sans">{durationSec}s</span>
                          </>
                        )}
                      </div>

                      {/* External Vercel URL */}
                      {deploy.url && (
                        <a
                          href={deploy.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 text-xs text-indigo-500 hover:text-indigo-700 inline-flex items-center gap-1 truncate max-w-xs"
                        >
                          {deploy.url}
                          <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      )}

                      {/* Detail / log message */}
                      {note && (
                        <div className={cn(
                          "mt-2 text-xs px-3 py-2 rounded-lg border leading-relaxed",
                          deploy.status === "failed"
                            ? "bg-red-50 border-red-100 text-red-700 font-mono"
                            : "bg-gray-50 border-gray-100 text-gray-500"
                        )}>
                          {note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Visit link — always shown */}
                  <div className="shrink-0">
                    <Link
                      href={`/published/${siteId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      Visit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
