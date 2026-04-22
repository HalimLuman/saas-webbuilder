"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Globe, Plus, Check, X, ExternalLink, Copy,
  AlertCircle, Loader2, RefreshCw, Shield, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

type DomainStatus = "active" | "pending" | "inactive";

interface SiteRecord {
  id: string;
  name: string;
  slug: string;
  status: string;
  custom_domain: string | null;
  created_at: string;
}

interface DomainRow {
  key: string;
  domain: string;
  siteName: string;
  siteId: string;
  status: DomainStatus;
  isBuiltIn: boolean;
  addedAt: string;
}

const DNS_RECORDS = [
  { type: "A",     name: "@",   value: "76.76.21.21",           ttl: "3600" },
  { type: "CNAME", name: "www", value: `cname.${ROOT_DOMAIN}`,  ttl: "3600" },
];

function StatusBadge({ status }: { status: DomainStatus }) {
  const cfg = {
    active:   { dot: "bg-green-400",  text: "text-green-700 bg-green-50 border-green-200",  label: "Active" },
    pending:  { dot: "bg-amber-400",  text: "text-amber-700 bg-amber-50 border-amber-200",  label: "Pending DNS" },
    inactive: { dot: "bg-gray-300",   text: "text-gray-500 bg-gray-50 border-gray-200",     label: "Inactive" },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border", cfg.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function sitesToDomainRows(sites: SiteRecord[]): DomainRow[] {
  const rows: DomainRow[] = [];
  for (const site of sites) {
    // Built-in subdomain
    rows.push({
      key: `${site.id}-builtin`,
      domain: `${site.slug}.${ROOT_DOMAIN}`,
      siteName: site.name,
      siteId: site.id,
      status: site.status === "published" ? "active" : "inactive",
      isBuiltIn: true,
      addedAt: new Date(site.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
    // Custom domain (if set)
    if (site.custom_domain) {
      rows.push({
        key: `${site.id}-custom`,
        domain: site.custom_domain,
        siteName: site.name,
        siteId: site.id,
        status: "pending",
        isBuiltIn: false,
        addedAt: new Date(site.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      });
    }
  }
  return rows;
}

export default function DomainsPage() {
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showDNSGuide, setShowDNSGuide] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/sites");
      if (!res.ok) throw new Error("Failed to fetch sites");
      const json = await res.json();
      setSites(json.data ?? []);
      if (json.data?.length > 0 && !selectedSiteId) {
        setSelectedSiteId(json.data[0].id);
      }
    } catch {
      toast.error("Could not load domain data.");
    } finally {
      setLoading(false);
    }
  }, [selectedSiteId]);

  useEffect(() => { fetchSites(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async () => {
    const domain = newDomain.trim();
    if (!domain || !selectedSiteId) return;
    setIsAdding(true);
    try {
      const res = await fetch(`/api/v1/sites/${selectedSiteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_domain: domain }),
      });
      if (!res.ok) throw new Error("Failed to add domain");
      setNewDomain("");
      setShowDNSGuide(true);
      toast.success("Domain added! Configure DNS records to activate it.");
      await fetchSites();
    } catch {
      toast.error("Failed to add domain. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (row: DomainRow) => {
    if (row.isBuiltIn) return;
    setRemoving(row.key);
    try {
      const res = await fetch(`/api/v1/sites/${row.siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_domain: null }),
      });
      if (!res.ok) throw new Error("Failed to remove domain");
      toast.success("Custom domain removed.");
      await fetchSites();
    } catch {
      toast.error("Failed to remove domain.");
    } finally {
      setRemoving(null);
    }
  };

  const handleVerify = async (row: DomainRow) => {
    setVerifying(row.key);
    // Re-fetch the site to get the latest status after DNS propagation
    try {
      await fetchSites();
      toast.info("DNS propagation can take up to 48 hours. Check back soon.");
    } finally {
      setVerifying(null);
    }
  };

  const copyToClipboard = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const domainRows = sitesToDomainRows(sites);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Domains</h1>
        <p className="text-sm text-gray-500 mt-0.5">Connect custom domains to your Webperia sites.</p>
      </div>

      {/* Add domain */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Add Custom Domain</h2>
        <div className="flex gap-3 flex-wrap">
          {/* Site selector */}
          <div className="relative">
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              disabled={sites.length === 0}
              className="appearance-none h-9 pl-3 pr-8 rounded-md border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-40"
            >
              {sites.length === 0 ? (
                <option>No sites yet</option>
              ) : (
                sites.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex-1 min-w-48">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="www.yourdomain.com"
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            />
          </div>

          <Button
            onClick={handleAdd}
            disabled={!newDomain.trim() || !selectedSiteId || isAdding}
            className="gap-2"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add Domain
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Custom domains require a Pro plan or higher.</p>
      </div>

      {/* DNS Guide */}
      {showDNSGuide && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 mb-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 mb-1">Configure your DNS records</p>
                <p className="text-xs text-amber-700 mb-4">
                  Add these records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):
                </p>
                <div className="rounded-xl border border-amber-200 overflow-hidden bg-white">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-amber-100 bg-amber-50/50">
                        <th className="text-left px-3 py-2 font-semibold text-amber-800">Type</th>
                        <th className="text-left px-3 py-2 font-semibold text-amber-800">Name</th>
                        <th className="text-left px-3 py-2 font-semibold text-amber-800">Value</th>
                        <th className="text-left px-3 py-2 font-semibold text-amber-800">TTL</th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {DNS_RECORDS.map((record, i) => (
                        <tr key={i} className="border-b border-amber-50 last:border-0">
                          <td className="px-3 py-2">
                            <span className="font-mono font-bold text-amber-700">{record.type}</span>
                          </td>
                          <td className="px-3 py-2 font-mono text-gray-700">{record.name}</td>
                          <td className="px-3 py-2 font-mono text-gray-700">{record.value}</td>
                          <td className="px-3 py-2 text-gray-500">{record.ttl}</td>
                          <td className="px-2 py-2">
                            <button
                              onClick={() => copyToClipboard(record.value, `${i}-value`)}
                              className="h-6 w-6 rounded flex items-center justify-center text-amber-500 hover:bg-amber-100 transition-colors"
                            >
                              {copied === `${i}-value` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDNSGuide(false)}
              className="text-amber-500 hover:text-amber-700 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Domains list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Your Domains ({loading ? "…" : domainRows.length})
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-gray-400 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : domainRows.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-8 w-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No domains yet</p>
            <p className="text-xs text-gray-400 mt-1">Create and publish a site to see its built-in subdomain here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {domainRows.map((row) => (
              <div key={row.key} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                {/* Icon */}
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                  row.status === "active"   ? "bg-green-50"  :
                  row.status === "pending"  ? "bg-amber-50"  : "bg-gray-50"
                )}>
                  <Globe className={cn(
                    "h-4 w-4",
                    row.status === "active"   ? "text-green-600"  :
                    row.status === "pending"  ? "text-amber-600"  : "text-gray-400"
                  )} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">{row.domain}</p>
                    {row.isBuiltIn && (
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
                        Built-in
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{row.siteName}</span>
                    <span>·</span>
                    <span>Since {row.addedAt}</span>
                  </div>
                </div>

                {/* Status + SSL indicator */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Shield className={cn(
                      "h-3.5 w-3.5",
                      row.status === "active" ? "text-green-500" : "text-gray-300"
                    )} />
                    <span className={row.status === "active" ? "text-green-600" : "text-gray-400"}>
                      {row.status === "active" ? "SSL Active" : "No SSL"}
                    </span>
                  </div>
                  <StatusBadge status={row.status} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {row.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleVerify(row)}
                      disabled={verifying === row.key}
                    >
                      {verifying === row.key ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      Verify
                    </Button>
                  )}
                  {row.status === "active" && (
                    <a
                      href={`http://${row.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {!row.isBuiltIn && (
                    <button
                      onClick={() => handleRemove(row)}
                      disabled={removing === row.key}
                      className="h-7 w-7 rounded-lg border border-red-100 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      {removing === row.key ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SSL info */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800 mb-1">SSL Certificates — Automatic</p>
            <p className="text-xs text-green-700 leading-relaxed">
              Webperia automatically provisions and renews SSL certificates for all connected domains via Let&apos;s Encrypt.
              HTTPS is enabled as soon as DNS propagation completes (usually within 24 hours).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
