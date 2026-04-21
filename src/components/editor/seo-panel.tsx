"use client";

import React, { useState } from "react";
import { Search, Globe, Twitter, Share2, Code2, ChevronDown } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";

type SEOTab = "basic" | "og" | "twitter" | "advanced";

const inputCls =
  "w-full text-[11px] px-2 py-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400";
const textareaCls =
  "w-full text-[11px] px-2 py-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none";
const labelCls = "text-[11px] font-medium text-gray-600 mb-1 block";

function CharCount({ value = "", max }: { value?: string; max: number }) {
  const len = value.length;
  return (
    <span className={cn("text-[10px]", len > max ? "text-red-500" : "text-gray-400")}>
      {len}/{max}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
      >
        {title}
        <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

export default function SEOPanel() {
  const { pageSEO, updatePageSEO, siteName } = useEditorStore();
  const [tab, setTab] = useState<SEOTab>("basic");
  const [jsonError, setJsonError] = useState("");

  const tabs: { id: SEOTab; icon: React.ReactNode; label: string }[] = [
    { id: "basic", icon: <Search className="w-3 h-3" />, label: "Basic" },
    { id: "og", icon: <Share2 className="w-3 h-3" />, label: "Open Graph" },
    { id: "twitter", icon: <Twitter className="w-3 h-3" />, label: "Twitter" },
    { id: "advanced", icon: <Code2 className="w-3 h-3" />, label: "Advanced" },
  ];

  const previewTitle = pageSEO.title || siteName || "Page Title";
  const previewDesc = pageSEO.description || "No description set.";
  const previewUrl = pageSEO.canonicalUrl || "https://yoursite.com/page";

  function handleJsonLD(val: string) {
    updatePageSEO({ structuredData: val });
    if (!val.trim()) { setJsonError(""); return; }
    try { JSON.parse(val); setJsonError(""); }
    catch { setJsonError("Invalid JSON"); }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden text-[11px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-gray-800">SEO Settings</span>
        </div>
        {/* SERP Preview */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-0.5">
          <div className="text-[10px] text-gray-400 mb-1">SERP Preview</div>
          <div className="text-[13px] font-medium text-blue-700 truncate leading-tight">{previewTitle}</div>
          <div className="text-[11px] text-green-700 truncate">{previewUrl}</div>
          <div className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">{previewDesc}</div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-100 px-2 pt-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1 px-2.5 py-2 text-[10px] font-medium border-b-2 transition-colors",
              tab === t.id
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "basic" && (
          <div className="px-4 py-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>Page Title</label>
                <CharCount value={pageSEO.title} max={60} />
              </div>
              <input
                className={inputCls}
                placeholder="Page title (50-60 chars recommended)"
                value={pageSEO.title || ""}
                onChange={(e) => updatePageSEO({ title: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>Meta Description</label>
                <CharCount value={pageSEO.description} max={160} />
              </div>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Meta description (150-160 chars recommended)"
                value={pageSEO.description || ""}
                onChange={(e) => updatePageSEO({ description: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Focus Keywords</label>
              <input
                className={inputCls}
                placeholder="keyword1, keyword2, keyword3"
                value={pageSEO.keywords || ""}
                onChange={(e) => updatePageSEO({ keywords: e.target.value })}
              />
            </div>
          </div>
        )}

        {tab === "og" && (
          <div className="px-4 py-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>OG Title</label>
                <CharCount value={pageSEO.ogTitle} max={60} />
              </div>
              <input
                className={inputCls}
                placeholder="Open Graph title"
                value={pageSEO.ogTitle || ""}
                onChange={(e) => updatePageSEO({ ogTitle: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>OG Description</label>
                <CharCount value={pageSEO.ogDescription} max={200} />
              </div>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Open Graph description"
                value={pageSEO.ogDescription || ""}
                onChange={(e) => updatePageSEO({ ogDescription: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>OG Image URL</label>
              <input
                className={inputCls}
                placeholder="https://example.com/og-image.jpg"
                value={pageSEO.ogImage || ""}
                onChange={(e) => updatePageSEO({ ogImage: e.target.value })}
              />
              {pageSEO.ogImage && (
                <img src={pageSEO.ogImage} alt="OG preview" className="mt-2 w-full rounded border border-gray-200 object-cover h-28" />
              )}
            </div>
          </div>
        )}

        {tab === "twitter" && (
          <div className="px-4 py-4 space-y-3">
            <div>
              <label className={labelCls}>Card Type</label>
              <select
                className="w-full text-[11px] px-2 py-1.5 rounded border border-gray-200 bg-white focus:outline-none"
                value={pageSEO.twitterCard || "summary_large_image"}
                onChange={(e) => updatePageSEO({ twitterCard: e.target.value as "summary" | "summary_large_image" })}
              >
                <option value="summary_large_image">Summary Large Image</option>
                <option value="summary">Summary</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>Twitter Title</label>
                <CharCount value={pageSEO.twitterTitle} max={70} />
              </div>
              <input
                className={inputCls}
                placeholder="Twitter card title"
                value={pageSEO.twitterTitle || ""}
                onChange={(e) => updatePageSEO({ twitterTitle: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>Twitter Description</label>
                <CharCount value={pageSEO.twitterDescription} max={200} />
              </div>
              <textarea
                className={textareaCls}
                rows={3}
                placeholder="Twitter card description"
                value={pageSEO.twitterDescription || ""}
                onChange={(e) => updatePageSEO({ twitterDescription: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Twitter Image URL</label>
              <input
                className={inputCls}
                placeholder="https://example.com/twitter-image.jpg"
                value={pageSEO.twitterImage || ""}
                onChange={(e) => updatePageSEO({ twitterImage: e.target.value })}
              />
            </div>
          </div>
        )}

        {tab === "advanced" && (
          <div className="px-4 py-4 space-y-3">
            <div>
              <label className={labelCls}>Canonical URL</label>
              <input
                className={inputCls}
                placeholder="https://yoursite.com/page"
                value={pageSEO.canonicalUrl || ""}
                onChange={(e) => updatePageSEO({ canonicalUrl: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!pageSEO.noIndex}
                  onChange={(e) => updatePageSEO({ noIndex: e.target.checked })}
                  className="rounded"
                />
                <span className={labelCls + " mb-0"}>No Index</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!pageSEO.noFollow}
                  onChange={(e) => updatePageSEO({ noFollow: e.target.checked })}
                  className="rounded"
                />
                <span className={labelCls + " mb-0"}>No Follow</span>
              </label>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>JSON-LD Structured Data</label>
                {jsonError && <span className="text-[10px] text-red-500">{jsonError}</span>}
              </div>
              <textarea
                className={cn(textareaCls, jsonError && "border-red-300")}
                rows={8}
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebPage"\n}`}
                value={pageSEO.structuredData || ""}
                onChange={(e) => handleJsonLD(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
