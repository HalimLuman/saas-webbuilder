"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Globe, Plus, Trash2, CheckCircle2, AlertCircle, ArrowLeft,
  Languages, RefreshCw, Download, Upload, ChevronDown,
  Search, Flag, Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSiteStore } from "@/store/site-store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isDefault: boolean;
  isEnabled: boolean;
  translationPct: number;
  urlStrategy: "subdirectory" | "subdomain" | "domain";
  urlValue: string;
  rtl: boolean;
}

// ─── Available languages pool ─────────────────────────────────────────────────

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", rtl: false },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", rtl: false },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", rtl: false },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", rtl: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", rtl: false },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", rtl: false },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", rtl: false },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "中文", flag: "🇨🇳", rtl: false },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", rtl: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", rtl: true },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", rtl: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", rtl: false },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", rtl: false },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", rtl: false },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", rtl: false },
];

// ─── Translation pages mock ───────────────────────────────────────────────────

const PAGES = [
  { id: "home", name: "Home", strings: 42 },
  { id: "about", name: "About", strings: 28 },
  { id: "pricing", name: "Pricing", strings: 35 },
  { id: "blog", name: "Blog", strings: 19 },
  { id: "contact", name: "Contact", strings: 22 },
];

// ─── Language Row ─────────────────────────────────────────────────────────────

function LanguageRow({
  lang,
  onRemove,
  onToggle,
  onSetDefault,
}: {
  lang: Language;
  onRemove: (code: string) => void;
  onToggle: (code: string) => void;
  onSetDefault: (code: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn("border border-gray-100 rounded-xl overflow-hidden bg-white", lang.isDefault && "border-indigo-200")}>
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="text-xl shrink-0">{lang.flag}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{lang.name}</span>
            <span className="text-xs text-gray-400">{lang.nativeName}</span>
            {lang.rtl && (
              <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-medium">RTL</span>
            )}
            {lang.isDefault && (
              <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-medium">Default</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
              <div
                className={cn("h-full rounded-full transition-all", lang.translationPct === 100 ? "bg-emerald-500" : lang.translationPct > 50 ? "bg-amber-400" : "bg-red-400")}
                style={{ width: `${lang.translationPct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500">{lang.translationPct}% translated</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!lang.isEnabled && (
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Disabled</span>
          )}
          <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", expanded && "rotate-180")} />
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 bg-gray-50/50 space-y-4 pt-3">
          {/* URL Strategy */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">URL Strategy</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["subdirectory", "subdomain", "domain"] as const).map((s) => (
                <div
                  key={s}
                  className={cn(
                    "px-2 py-1.5 rounded-lg border text-center cursor-pointer transition-colors text-[11px]",
                    lang.urlStrategy === s ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium" : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                  )}
                >
                  {s === "subdirectory" ? "/fr/..." : s === "subdomain" ? "fr.site.com" : "site.fr"}
                </div>
              ))}
            </div>
          </div>

          {/* URL value */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              {lang.urlStrategy === "subdirectory" ? "Path prefix" : lang.urlStrategy === "subdomain" ? "Subdomain" : "Domain"}
            </label>
            <input
              defaultValue={lang.urlValue}
              className="w-full h-7 px-2.5 text-[11px] rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              placeholder={lang.urlStrategy === "subdirectory" ? lang.code : lang.urlStrategy === "subdomain" ? `${lang.code}.yoursite.com` : "yoursite.fr"}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            {!lang.isDefault && (
              <button
                onClick={() => onSetDefault(lang.code)}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Set as Default
              </button>
            )}
            <button
              onClick={() => onToggle(lang.code)}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-lg border transition-colors",
                lang.isEnabled ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              )}
            >
              {lang.isEnabled ? "Disable" : "Enable"}
            </button>
            <button
              className="text-[11px] px-2.5 py-1 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> AI Translate
            </button>
            {!lang.isDefault && (
              <button
                onClick={() => onRemove(lang.code)}
                className="text-[11px] px-2.5 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors ml-auto"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Add Language Modal ───────────────────────────────────────────────────────

function AddLanguageModal({
  existingCodes,
  onAdd,
  onClose,
}: {
  existingCodes: string[];
  onAdd: (code: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const available = AVAILABLE_LANGUAGES.filter(
    (l) => !existingCodes.includes(l.code) &&
      (l.name.toLowerCase().includes(search.toLowerCase()) || l.nativeName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Add Language</h3>
          <p className="text-xs text-gray-500 mt-0.5">Select a language to add to your site</p>
        </div>
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search languages..."
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto px-2 pb-2">
          {available.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onAdd(lang.code); onClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-left"
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-900">{lang.name}</div>
                <div className="text-[10px] text-gray-400">{lang.nativeName}</div>
              </div>
              {lang.rtl && <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">RTL</span>}
            </button>
          ))}
          {available.length === 0 && (
            <p className="text-center text-xs text-gray-400 py-6">No languages match your search</p>
          )}
        </div>
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <button onClick={onClose} className="w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LocalizationPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const getSiteById = useSiteStore((s) => s.getSiteById);
  const site = getSiteById(siteId);

  const [activeTab, setActiveTab] = useState<"languages" | "translations" | "settings">("languages");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home");

  const [languages, setLanguages] = useState<Language[]>([
    {
      code: "en", name: "English", nativeName: "English", flag: "🇺🇸",
      isDefault: true, isEnabled: true, translationPct: 100,
      urlStrategy: "subdirectory", urlValue: "", rtl: false,
    },
    {
      code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸",
      isDefault: false, isEnabled: true, translationPct: 68,
      urlStrategy: "subdirectory", urlValue: "es", rtl: false,
    },
    {
      code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷",
      isDefault: false, isEnabled: false, translationPct: 32,
      urlStrategy: "subdirectory", urlValue: "fr", rtl: false,
    },
  ]);

  // Locale settings
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12h");
  const [currency, setCurrency] = useState("USD");
  const [numberSeparator, setNumberSeparator] = useState("en-US");
  const [autoDetect, setAutoDetect] = useState(true);
  const [fallbackLang, setFallbackLang] = useState("en");
  const [showSwitcher, setShowSwitcher] = useState(true);
  const [switcherStyle, setSwitcherStyle] = useState<"dropdown" | "flags" | "text">("dropdown");

  function handleAddLanguage(code: string) {
    const lang = AVAILABLE_LANGUAGES.find((l) => l.code === code);
    if (!lang) return;
    setLanguages((prev) => [...prev, {
      ...lang,
      isDefault: false,
      isEnabled: true,
      translationPct: 0,
      urlStrategy: "subdirectory",
      urlValue: code,
    }]);
    toast.success(`${lang.name} added`);
  }

  function handleRemove(code: string) {
    setLanguages((prev) => prev.filter((l) => l.code !== code));
    toast.success("Language removed");
  }

  function handleToggle(code: string) {
    setLanguages((prev) => prev.map((l) => l.code === code ? { ...l, isEnabled: !l.isEnabled } : l));
  }

  function handleSetDefault(code: string) {
    setLanguages((prev) => prev.map((l) => ({ ...l, isDefault: l.code === code })));
    toast.success("Default language updated");
  }

  // Mock translation strings for the selected page
  const mockStrings = [
    { key: "hero.headline", en: "Build faster websites", es: "Crea sitios web más rápidos", fr: "" },
    { key: "hero.subheadline", en: "The all-in-one web builder", es: "El constructor web todo en uno", fr: "Le constructeur web tout-en-un" },
    { key: "hero.cta", en: "Get started for free", es: "", fr: "" },
    { key: "nav.features", en: "Features", es: "Características", fr: "Fonctionnalités" },
    { key: "nav.pricing", en: "Pricing", es: "Precios", fr: "" },
  ];

  const nonDefaultLangs = languages.filter((l) => !l.isDefault);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-1">
            <Link
              href={`/dashboard/sites/${siteId}/settings`}
              className="h-7 w-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Languages className="h-5 w-5 text-indigo-500" />
                Localization & i18n
              </h1>
              <p className="text-xs text-gray-500">{site?.name || siteId}</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-1 mt-3">
            {([
              { id: "languages", label: "Languages", icon: Globe },
              { id: "translations", label: "Translations", icon: Languages },
              { id: "settings", label: "Locale Settings", icon: Settings2 },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  activeTab === id ? "bg-indigo-50 text-indigo-700" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">

        {/* ── Languages Tab ── */}
        {activeTab === "languages" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">{languages.length} language{languages.length !== 1 ? "s" : ""} configured</h2>
                <p className="text-xs text-gray-500 mt-0.5">Manage languages for your site</p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="gap-1.5 h-8 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Add Language
              </Button>
            </div>

            <div className="space-y-3">
              {languages.map((lang) => (
                <LanguageRow
                  key={lang.code}
                  lang={lang}
                  onRemove={handleRemove}
                  onToggle={handleToggle}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{languages.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total languages</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {languages.filter((l) => l.translationPct === 100).length}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Fully translated</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {languages.filter((l) => l.rtl).length}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">RTL languages</div>
              </div>
            </div>
          </>
        )}

        {/* ── Translations Tab ── */}
        {activeTab === "translations" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Translation Editor</h2>
                <p className="text-xs text-gray-500 mt-0.5">Edit translations per page and per language</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Upload className="h-3 w-3" /> Import .xliff
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Download className="h-3 w-3" /> Export .xliff
                </button>
              </div>
            </div>

            {/* Page selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PAGES.map((p) => {
                const pct = p.id === "home" ? 68 : p.id === "about" ? 95 : p.id === "pricing" ? 40 : p.id === "blog" ? 100 : 20;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPage(p.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors border",
                      selectedPage === p.id ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                    )}
                  >
                    {p.name}
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-bold",
                      pct === 100 ? "bg-emerald-100 text-emerald-700" : pct > 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                    )}>
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Translation table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50/50">
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-40">Key</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">🇺🇸 English (source)</th>
                      {nonDefaultLangs.map((l) => (
                        <th key={l.code} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                          {l.flag} {l.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {mockStrings.map((row) => (
                      <tr key={row.key} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <code className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{row.key}</code>
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-[11px]">{row.en}</td>
                        {nonDefaultLangs.map((l) => {
                          const val = l.code === "es" ? row.es : l.code === "fr" ? row.fr : "";
                          return (
                            <td key={l.code} className="px-4 py-2.5">
                              <div className="relative">
                                <input
                                  defaultValue={val}
                                  placeholder="Not translated"
                                  className={cn(
                                    "w-full h-7 px-2 text-[11px] rounded border focus:outline-none focus:ring-1 focus:ring-indigo-400",
                                    !val ? "border-amber-200 bg-amber-50 placeholder-amber-400" : "border-transparent bg-transparent hover:border-gray-200 focus:bg-white"
                                  )}
                                />
                                {!val && (
                                  <AlertCircle className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-amber-400" />
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{mockStrings.length} strings on this page</span>
                <button
                  onClick={() => toast.success("Translations saved")}
                  className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* AI translate CTA */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">AI-powered translation</p>
                <p className="text-xs text-gray-600 mt-0.5">Translate all untranslated strings to all languages with one click using DeepL + AI</p>
              </div>
              <button
                onClick={() => toast.success("AI translation started in background")}
                className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shrink-0"
              >
                Translate All
              </button>
            </div>
          </>
        )}

        {/* ── Locale Settings Tab ── */}
        {activeTab === "settings" && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
              <div className="px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Language Switcher</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700 font-medium">Show language switcher</p>
                      <p className="text-xs text-gray-400">Display a language picker on the published site</p>
                    </div>
                    <button
                      onClick={() => setShowSwitcher((v) => !v)}
                      className={cn("w-10 h-5 rounded-full transition-colors relative", showSwitcher ? "bg-indigo-600" : "bg-gray-200")}
                    >
                      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", showSwitcher ? "translate-x-5" : "translate-x-0.5")} />
                    </button>
                  </div>
                  {showSwitcher && (
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Switcher style</label>
                      <div className="flex gap-2">
                        {(["dropdown", "flags", "text"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setSwitcherStyle(s)}
                            className={cn(
                              "px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize",
                              switcherStyle === s ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            {s === "dropdown" ? "🔽 Dropdown" : s === "flags" ? "🏳️ Flags" : "🔤 Text only"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Auto-Detection</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700 font-medium">Browser language detection</p>
                    <p className="text-xs text-gray-400">Redirect visitors to their browser language if available</p>
                  </div>
                  <button
                    onClick={() => setAutoDetect((v) => !v)}
                    className={cn("w-10 h-5 rounded-full transition-colors relative", autoDetect ? "bg-indigo-600" : "bg-gray-200")}
                  >
                    <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", autoDetect ? "translate-x-5" : "translate-x-0.5")} />
                  </button>
                </div>
                <div className="mt-3">
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Fallback language</label>
                  <select
                    value={fallbackLang}
                    onChange={(e) => setFallbackLang(e.target.value)}
                    className="h-8 px-2.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Formatting</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Date format</label>
                    <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full h-8 px-2.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Time format</label>
                    <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} className="w-full h-8 px-2.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400">
                      <option value="12h">12-hour (AM/PM)</option>
                      <option value="24h">24-hour</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Currency</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-8 px-2.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Number format</label>
                    <select value={numberSeparator} onChange={(e) => setNumberSeparator(e.target.value)} className="w-full h-8 px-2.5 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400">
                      <option value="en-US">1,234.56 (US)</option>
                      <option value="de-DE">1.234,56 (EU)</option>
                      <option value="fr-FR">1 234,56 (FR)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => toast.success("Locale settings saved")} size="sm">
                Save Settings
              </Button>
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <AddLanguageModal
          existingCodes={languages.map((l) => l.code)}
          onAdd={handleAddLanguage}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
