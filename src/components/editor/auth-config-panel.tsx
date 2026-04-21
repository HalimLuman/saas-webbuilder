"use client";

/**
 * AuthConfigPanel
 *
 * Left-sidebar panel in the editor for configuring site-level authentication.
 * Lets the builder:
 *  1. Pick a provider (Supabase / Firebase / Custom / None)
 *  2. Enter the provider's credentials / ENV keys
 *  3. Choose which social providers to expose (Google, GitHub)
 *  4. Set post-auth redirect slugs
 *
 * Saves to `site.authConfig` via the site store (which auto-saves to Supabase).
 */

import React, { useState, useEffect } from "react";
import { Shield, ChevronDown, ChevronRight, Check, Eye, EyeOff, Info } from "lucide-react";
import { useSiteStore } from "@/store/site-store";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import type { SiteAuthConfig, SiteAuthProvider } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PROVIDERS: { id: SiteAuthProvider; label: string; icon: string; description: string }[] = [
  { id: "none", label: "None", icon: "🔓", description: "No auth for this site" },
  { id: "supabase", label: "Supabase", icon: "⚡", description: "Auth via Supabase — easiest to set up" },
  { id: "firebase", label: "Firebase", icon: "🔥", description: "Google Firebase Authentication" },
  { id: "custom", label: "Custom API", icon: "🔧", description: "Your own REST auth endpoints" },
];

const SOCIAL_OPTIONS = [
  { id: "email" as const, label: "Email + Password" },
  { id: "google" as const, label: "Google" },
  { id: "github" as const, label: "GitHub" },
  { id: "magic-link" as const, label: "Magic Link (passwordless)" },
];

function MaskedInput({
  label, value, onChange, placeholder, helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helpText?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%", padding: "8px 36px 8px 10px", border: "1px solid #E5E7EB",
            borderRadius: "8px", fontSize: "13px", backgroundColor: "#FAFAFA",
            boxSizing: "border-box", outline: "none",
          }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9CA3AF" }}
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      {helpText && <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF", lineHeight: "1.4" }}>{helpText}</p>}
    </div>
  );
}

function TextInput({
  label, value, onChange, placeholder, helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  helpText?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB",
          borderRadius: "8px", fontSize: "13px", backgroundColor: "#FAFAFA",
          boxSizing: "border-box", outline: "none",
        }}
      />
      {helpText && <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF", lineHeight: "1.4" }}>{helpText}</p>}
    </div>
  );
}

function PageSlugSelect({
  label, value, onChange, pages, helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  pages: Array<{ name: string; slug: string }>;
  helpText?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "11px", fontWeight: 600, color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB",
          borderRadius: "8px", fontSize: "13px", backgroundColor: "#FAFAFA",
          boxSizing: "border-box", outline: "none", cursor: "pointer",
        }}
      >
        <option value="">— none —</option>
        {pages.map(p => (
          <option key={p.slug} value={p.slug}>{p.name} ({p.slug})</option>
        ))}
      </select>
      {helpText && <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF", lineHeight: "1.4" }}>{helpText}</p>}
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #F3F4F6" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "none", border: "none", cursor: "pointer" }}
      >
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>{title}</span>
        {open ? <ChevronDown size={14} color="#9CA3AF" /> : <ChevronRight size={14} color="#9CA3AF" />}
      </button>
      {open && <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AuthConfigPanel() {
  const siteId = useEditorStore(s => s.siteId);
  const getSiteById = useSiteStore(s => s.getSiteById);
  const updateSite = useSiteStore(s => s.updateSite);

  const site = siteId ? getSiteById(siteId) : undefined;
  const sitePages = site?.pages?.map(p => ({ name: p.name, slug: p.slug })) ?? [];

  const [cfg, setCfg] = useState<SiteAuthConfig>(() => site?.authConfig ?? {
    provider: "none",
    enabled: false,
    allowedProviders: ["email"],
  });
  const [saved, setSaved] = useState(false);

  // Sync if site changes externally
  useEffect(() => {
    if (site?.authConfig) setCfg(site.authConfig);
  }, [site?.authConfig]);

  const update = (partial: Partial<SiteAuthConfig>) => {
    setCfg(prev => ({ ...prev, ...partial }));
    setSaved(false);
  };

  const save = () => {
    if (!siteId) return;
    updateSite(siteId, { authConfig: cfg });
    // Also persist to Supabase via PATCH
    fetch(`/api/v1/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth_config: cfg }),
    }).catch(console.error);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleProvider = (id: NonNullable<SiteAuthConfig["allowedProviders"]>[number]) => {
    const current = cfg.allowedProviders ?? [];
    const next = current.includes(id) ? current.filter(p => p !== id) : [...current, id];
    update({ allowedProviders: next });
  };

  if (!siteId) {
    return (
      <div style={{ padding: "24px 16px", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
        No site loaded
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: "8px" }}>
        <Shield size={16} color="#6366F1" />
        <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Auth Settings</span>
      </div>

      {/* Enable toggle */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#111827" }}>Enable Auth</p>
          <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF" }}>Let visitors sign in / sign up on this site</p>
        </div>
        <button
          onClick={() => update({ enabled: !cfg.enabled, provider: cfg.enabled ? "none" : (cfg.provider === "none" ? "supabase" : cfg.provider) })}
          style={{
            width: "40px", height: "22px", borderRadius: "999px", border: "none", cursor: "pointer",
            backgroundColor: cfg.enabled ? "#6366F1" : "#D1D5DB",
            position: "relative", transition: "background 0.2s",
          }}
        >
          <div style={{
            position: "absolute", top: "3px", left: cfg.enabled ? "21px" : "3px",
            width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#FFFFFF",
            transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }} />
        </button>
      </div>

      {cfg.enabled && (
        <>
          {/* Provider picker */}
          <Section title="Provider">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {PROVIDERS.filter(p => p.id !== "none").map(p => (
                <button
                  key={p.id}
                  onClick={() => update({ provider: p.id })}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left",
                    backgroundColor: cfg.provider === p.id ? "#EEF2FF" : "#F9FAFB",
                    outline: cfg.provider === p.id ? "2px solid #6366F1" : "none",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#111827" }}>{p.label}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF" }}>{p.description}</p>
                  </div>
                  {cfg.provider === p.id && <Check size={14} color="#6366F1" />}
                </button>
              ))}
            </div>
          </Section>

          {/* Provider credentials */}
          {cfg.provider === "supabase" && (
            <Section title="Supabase Credentials">
              <div style={{ padding: "8px 10px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <Info size={13} color="#D97706" style={{ flexShrink: 0, marginTop: "1px" }} />
                <p style={{ margin: 0, fontSize: "11px", color: "#92400E", lineHeight: "1.5" }}>
                  Use your <strong>Project URL</strong> and <strong>anon public key</strong> from the Supabase dashboard → Project Settings → API. The anon key is safe to expose.
                </p>
              </div>
              <TextInput
                label="Project URL"
                value={cfg.supabase?.url ?? ""}
                onChange={v => update({ supabase: { ...cfg.supabase, url: v, anonKey: cfg.supabase?.anonKey ?? "" } })}
                placeholder="https://xxxx.supabase.co"
              />
              <MaskedInput
                label="Anon Public Key"
                value={cfg.supabase?.anonKey ?? ""}
                onChange={v => update({ supabase: { url: cfg.supabase?.url ?? "", anonKey: v } })}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
              />
            </Section>
          )}

          {cfg.provider === "firebase" && (
            <Section title="Firebase Credentials">
              <TextInput
                label="API Key"
                value={cfg.firebase?.apiKey ?? ""}
                onChange={v => update({ firebase: { ...(cfg.firebase ?? { authDomain: "", projectId: "" }), apiKey: v } })}
                placeholder="AIzaSy..."
              />
              <TextInput
                label="Auth Domain"
                value={cfg.firebase?.authDomain ?? ""}
                onChange={v => update({ firebase: { ...(cfg.firebase ?? { apiKey: "", projectId: "" }), authDomain: v } })}
                placeholder="your-app.firebaseapp.com"
              />
              <TextInput
                label="Project ID"
                value={cfg.firebase?.projectId ?? ""}
                onChange={v => update({ firebase: { ...(cfg.firebase ?? { apiKey: "", authDomain: "" }), projectId: v } })}
                placeholder="your-app-id"
              />
            </Section>
          )}

          {cfg.provider === "custom" && (
            <Section title="Custom Endpoints">
              <div style={{ padding: "8px 10px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE", fontSize: "11px", color: "#1E40AF", lineHeight: "1.5" }}>
                Each URL must accept <code>POST</code> with a JSON body and return <code>&#123; user, accessToken, expiresAt &#125;</code>.
              </div>
              {(["signInUrl", "signUpUrl", "signOutUrl", "sessionUrl"] as const).map(field => (
                <TextInput
                  key={field}
                  label={field.replace(/([A-Z])/g, " $1").replace("Url", " URL")}
                  value={cfg.custom?.[field] ?? ""}
                  onChange={v => update({ custom: { signInUrl: "", signUpUrl: "", signOutUrl: "", sessionUrl: "", ...cfg.custom, [field]: v } })}
                  placeholder="https://api.example.com/auth/..."
                />
              ))}
            </Section>
          )}

          {/* Auth methods */}
          <Section title="Sign-In Methods">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {SOCIAL_OPTIONS.map(opt => {
                const active = (cfg.allowedProviders ?? []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleProvider(opt.id)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "9px 12px", borderRadius: "8px", border: "none", cursor: "pointer",
                      backgroundColor: active ? "#EEF2FF" : "#F9FAFB",
                      outline: active ? "2px solid #6366F1" : "none",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 500, color: active ? "#4338CA" : "#374151" }}>{opt.label}</span>
                    <div style={{
                      width: "16px", height: "16px", borderRadius: "4px", border: `2px solid ${active ? "#6366F1" : "#D1D5DB"}`,
                      backgroundColor: active ? "#6366F1" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {active && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Page assignments — auth-aware routing */}
          <Section title="Auth Pages">
            <PageSlugSelect
              label="Sign-In Page"
              value={cfg.signInPageSlug ?? ""}
              onChange={v => update({ signInPageSlug: v })}
              pages={sitePages}
              helpText="Private pages redirect here when not signed in"
            />
            <PageSlugSelect
              label="Sign-Up Page"
              value={cfg.signUpPageSlug ?? ""}
              onChange={v => update({ signUpPageSlug: v })}
              pages={sitePages}
              helpText="Optional — link sign-in ↔ sign-up forms to each other"
            />
          </Section>

          {/* Redirects */}
          <Section title="Post-Auth Redirects" defaultOpen={false}>
            <PageSlugSelect
              label="After Sign-In"
              value={cfg.redirectAfterSignIn ?? ""}
              onChange={v => update({ redirectAfterSignIn: v })}
              pages={sitePages}
              helpText="Where to send the user after a successful sign-in"
            />
            <PageSlugSelect
              label="After Sign-Out"
              value={cfg.redirectAfterSignOut ?? ""}
              onChange={v => update({ redirectAfterSignOut: v })}
              pages={sitePages}
              helpText="Where to send the user after sign-out"
            />
            <PageSlugSelect
              label="If Already Signed In"
              value={cfg.redirectIfAuthenticated ?? ""}
              onChange={v => update({ redirectIfAuthenticated: v })}
              pages={sitePages}
              helpText="Redirect signed-in users away from login/signup pages"
            />
          </Section>
        </>
      )}

      {/* Save button */}
      <div style={{ padding: "14px 16px", marginTop: "auto", borderTop: "1px solid #F3F4F6" }}>
        <button
          onClick={save}
          style={{
            width: "100%", padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer",
            backgroundColor: saved ? "#10B981" : "#6366F1",
            color: "#FFFFFF", fontWeight: 700, fontSize: "13px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            transition: "background 0.2s",
          }}
        >
          {saved ? <><Check size={14} /> Saved!</> : "Save Auth Settings"}
        </button>
        <p style={{ margin: "8px 0 0", fontSize: "11px", color: "#9CA3AF", textAlign: "center" }}>
          Settings are stored securely in your site configuration.
        </p>
      </div>
    </div>
  );
}
