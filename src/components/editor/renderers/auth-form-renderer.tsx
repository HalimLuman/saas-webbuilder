"use client";

import React, { useState } from "react";
import { useSiteAuth } from "@/lib/site-auth-context";
import { useIsPreview } from "@/lib/preview-context";
import { useToast } from "@/components/ui/toast";
import type { CanvasElement } from "@/lib/types";

type AuthVariant = "minimal" | "split" | "glass" | "dark" | "elevated" | "aurora";

interface AuthFormProps {
  element: CanvasElement;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// ─── Per-variant color tokens ─────────────────────────────────────────────────

const TOKENS: Record<AuthVariant, {
  text: string; muted: string; inputBg: string; inputBorder: string;
  cardBg: string; labelColor: string;
}> = {
  minimal:  { text: "#0F172A", muted: "#64748B", inputBg: "#FFFFFF",                 inputBorder: "#E2E8F0",                 cardBg: "#FFFFFF",                 labelColor: "#374151" },
  split:    { text: "#0F172A", muted: "#64748B", inputBg: "#FFFFFF",                 inputBorder: "#E2E8F0",                 cardBg: "#FFFFFF",                 labelColor: "#374151" },
  glass:    { text: "#FFFFFF", muted: "#CBD5E1", inputBg: "rgba(255,255,255,0.10)", inputBorder: "rgba(255,255,255,0.22)", cardBg: "rgba(255,255,255,0.10)", labelColor: "rgba(255,255,255,0.85)" },
  dark:     { text: "#F1F5F9", muted: "#94A3B8", inputBg: "rgba(255,255,255,0.06)", inputBorder: "rgba(255,255,255,0.10)", cardBg: "rgba(255,255,255,0.04)", labelColor: "#CBD5E1" },
  elevated: { text: "#0F172A", muted: "#64748B", inputBg: "#F8FAFC",                inputBorder: "#E2E8F0",                 cardBg: "#FFFFFF",                 labelColor: "#374151" },
  aurora:   { text: "#FFFFFF", muted: "#BAC9E0", inputBg: "rgba(255,255,255,0.08)", inputBorder: "rgba(255,255,255,0.16)", cardBg: "rgba(20,20,60,0.45)",    labelColor: "rgba(255,255,255,0.85)" },
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const Icons = {
  email: (c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  lock:  (c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  user:  (c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  eye:   (c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:(c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  arrow: (c: string) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  check: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  warn:  (c: string) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  mail:  (c: string) => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  shield:(c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

// ─── FieldError ───────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <span style={{ fontSize: "12px", color: "#EF4444", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
      {Icons.warn("#EF4444")}
      {msg}
    </span>
  );
}

// ─── TextInput ────────────────────────────────────────────────────────────────

function TextInput({ type, value, onChange, placeholder, hasError, variant, icon, accentColor }: {
  type: string; value: string; onChange: (v: string) => void; placeholder: string;
  hasError: boolean; variant: AuthVariant; icon: React.ReactNode; accentColor: string;
}) {
  const [focused, setFocused] = useState(false);
  const t = TOKENS[variant];
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <span style={{ position: "absolute", left: "13px", display: "flex", color: hasError ? "#F87171" : t.muted, pointerEvents: "none", zIndex: 1 }}>{icon}</span>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 14px 12px 42px", borderRadius: "10px",
          border: `1.5px solid ${hasError ? "#F87171" : focused ? accentColor : t.inputBorder}`,
          backgroundColor: t.inputBg, color: t.text, fontSize: "14px",
          outline: "none", boxSizing: "border-box",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: focused ? `0 0 0 3px ${hasError ? "rgba(248,113,113,0.12)" : accentColor + "22"}` : "none",
        }}
      />
    </div>
  );
}

// ─── PasswordInput ────────────────────────────────────────────────────────────

function PasswordInput({ value, onChange, placeholder, hasError, variant, accentColor }: {
  value: string; onChange: (v: string) => void; placeholder: string;
  hasError: boolean; variant: AuthVariant; accentColor: string;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const t = TOKENS[variant];
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <span style={{ position: "absolute", left: "13px", display: "flex", color: hasError ? "#F87171" : t.muted, pointerEvents: "none", zIndex: 1 }}>{Icons.lock(hasError ? "#F87171" : t.muted)}</span>
      <input
        type={show ? "text" : "password"} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "12px 44px 12px 42px", borderRadius: "10px",
          border: `1.5px solid ${hasError ? "#F87171" : focused ? accentColor : t.inputBorder}`,
          backgroundColor: t.inputBg, color: t.text, fontSize: "14px",
          outline: "none", boxSizing: "border-box",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: focused ? `0 0 0 3px ${hasError ? "rgba(248,113,113,0.12)" : accentColor + "22"}` : "none",
        }}
      />
      <button type="button" onClick={() => setShow(s => !s)} style={{ position: "absolute", right: "12px", background: "none", border: "none", cursor: "pointer", color: t.muted, display: "flex", padding: "4px" }}>
        {show ? Icons.eyeOff(t.muted) : Icons.eye(t.muted)}
      </button>
    </div>
  );
}

// ─── SocialButtons ────────────────────────────────────────────────────────────

function SocialButtons({ variant, onGoogle, onGithub, hasGoogle, hasGithub }: {
  variant: AuthVariant; onGoogle: () => void; onGithub: () => void; hasGoogle: boolean; hasGithub: boolean;
}) {
  const t = TOKENS[variant];
  const isDark = variant === "dark" || variant === "glass" || variant === "aurora";
  const both = hasGoogle && hasGithub;
  const base: React.CSSProperties = {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    padding: "11px 16px", borderRadius: "10px", fontWeight: 600, fontSize: "14px",
    cursor: "pointer", border: `1.5px solid ${isDark ? "rgba(255,255,255,0.14)" : "#E2E8F0"}`,
    backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF", color: t.text,
  };
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {hasGoogle && (
        <button type="button" onClick={onGoogle} style={base}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {both ? "Google" : "Continue with Google"}
        </button>
      )}
      {hasGithub && (
        <button type="button" onClick={onGithub} style={{ ...base, backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#24292E", color: "#FFFFFF", border: isDark ? `1.5px solid rgba(255,255,255,0.14)` : "none" }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          {both ? "GitHub" : "Continue with GitHub"}
        </button>
      )}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider({ variant }: { variant: AuthVariant }) {
  const t = TOKENS[variant];
  const isDark = variant === "dark" || variant === "glass" || variant === "aurora";
  const line = isDark ? "rgba(255,255,255,0.10)" : "#E2E8F0";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ flex: 1, height: "1px", backgroundColor: line }} />
      <span style={{ fontSize: "11px", fontWeight: 600, color: t.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>or</span>
      <div style={{ flex: 1, height: "1px", backgroundColor: line }} />
    </div>
  );
}

// ─── SubmitButton ─────────────────────────────────────────────────────────────

function SubmitButton({ text, loading, disabled, accentColor }: {
  text: string; loading: boolean; disabled: boolean; accentColor: string;
}) {
  return (
    <>
      <style>{`@keyframes auth-form-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        type="submit"
        disabled={loading || disabled}
        style={{
          padding: "13px 20px", borderRadius: "10px", border: "none",
          background: disabled ? "#9CA3AF" : `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
          color: "#FFFFFF", fontWeight: 700, fontSize: "15px",
          cursor: loading || disabled ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          boxShadow: disabled ? "none" : `0 4px 18px ${accentColor}44`,
          letterSpacing: "0.01em", transition: "opacity 0.15s",
          opacity: loading ? 0.85 : 1,
        }}
      >
        {loading ? (
          <>
            <span style={{ display: "inline-flex", animation: "auth-form-spin 0.75s linear infinite" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>
            </span>
            Please wait…
          </>
        ) : (
          <>{text}{Icons.arrow("#FFFFFF")}</>
        )}
      </button>
    </>
  );
}

// ─── FormShell ────────────────────────────────────────────────────────────────

function FormShell({ variant, accentColor, children }: { variant: AuthVariant; accentColor: string; children: React.ReactNode }) {

  if (variant === "split") {
    return (
      <div style={{ display: "flex", minHeight: "620px", backgroundColor: "#FFFFFF", overflow: "hidden", borderRadius: "inherit" }}>
        {/* Brand panel */}
        <div style={{
          flex: "0 0 44%", position: "relative", overflow: "hidden",
          background: `linear-gradient(155deg, ${accentColor} 0%, ${accentColor}AA 100%)`,
          padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-80px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "40%", left: "10%", width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
          <div style={{ position: "absolute", top: "25%", right: "20%", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />

          <div style={{ width: "44px", height: "44px", borderRadius: "14px", backgroundColor: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
            {Icons.shield("rgba(255,255,255,0.9)")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", position: "relative", zIndex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "34px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.04em", lineHeight: 1.15 }}>
              Build something<br />remarkable.
            </h2>
            <p style={{ margin: 0, fontSize: "15px", color: "rgba(255,255,255,0.72)", lineHeight: 1.65 }}>
              Join thousands of teams that ship faster and smarter with our platform.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", position: "relative", zIndex: 1 }}>
            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.82)", lineHeight: 1.6, fontStyle: "italic" }}>
              "This platform completely changed how our team ships. An absolute game-changer."
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#FFF", flexShrink: 0 }}>A</div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>Alex Chen</p>
                <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>CTO, Acme Corp · ★★★★★</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div style={{ flex: 1, backgroundColor: "#FFFFFF", padding: "56px 52px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "22px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    );
  }

  if (variant === "glass") {
    return (
      <div style={{
        padding: "80px 40px", display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "600px", position: "relative", overflow: "hidden",
        background: `radial-gradient(ellipse at 20% 50%, ${accentColor}55 0%, transparent 55%), radial-gradient(ellipse at 80% 15%, #8B5CF6 0%, transparent 50%), radial-gradient(ellipse at 65% 85%, #0EA5E9 0%, transparent 50%), #0F0F1A`,
      }}>
        <div style={{ position: "absolute", top: "12%", left: "8%",  width: "7px", height: "7px", borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
        <div style={{ position: "absolute", top: "32%", right: "9%", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
        <div style={{ position: "absolute", bottom: "18%", left: "14%", width: "9px", height: "9px", borderRadius: "50%", background: "rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", bottom: "35%", right: "18%", width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.18)" }} />
        <div style={{
          backgroundColor: "rgba(255,255,255,0.10)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.18)", borderRadius: "24px",
          padding: "48px 44px", maxWidth: "440px", width: "100%",
          display: "flex", flexDirection: "column", gap: "22px",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}>
          {children}
        </div>
      </div>
    );
  }

  if (variant === "dark") {
    return (
      <div style={{
        padding: "80px 40px", display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "600px", backgroundColor: "#080D1A", position: "relative", overflow: "hidden",
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)",
        backgroundSize: "28px 28px",
      }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "600px", height: "220px", background: `radial-gradient(ellipse, ${accentColor}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{
          backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px", padding: "48px 44px", maxWidth: "440px", width: "100%",
          display: "flex", flexDirection: "column", gap: "22px",
          boxShadow: "0 24px 56px rgba(0,0,0,0.55)", position: "relative", zIndex: 1,
        }}>
          {children}
        </div>
      </div>
    );
  }

  if (variant === "elevated") {
    return (
      <div style={{
        padding: "60px 40px", display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "600px", backgroundColor: "#EEF2F7",
        backgroundImage: `radial-gradient(ellipse at 70% 20%, ${accentColor}12 0%, transparent 55%)`,
      }}>
        <div style={{
          backgroundColor: "#FFFFFF", borderRadius: "28px",
          padding: "52px 48px", maxWidth: "460px", width: "100%",
          display: "flex", flexDirection: "column", gap: "24px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.03), 0 16px 40px rgba(0,0,0,0.08), 0 56px 80px rgba(0,0,0,0.06)",
        }}>
          {children}
        </div>
      </div>
    );
  }

  if (variant === "aurora") {
    return (
      <div style={{
        padding: "80px 40px", display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "600px", position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse at 30% 65%, #7C3AED 0%, transparent 55%), radial-gradient(ellipse at 75% 20%, #0EA5E9 0%, transparent 50%), radial-gradient(ellipse at 88% 78%, #EC4899 0%, transparent 45%), #0D1117",
      }}>
        <div style={{ position: "absolute", top: "18%", left: "-8%", width: "116%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.35), rgba(14,165,233,0.35), transparent)", transform: "rotate(-6deg)", filter: "blur(4px)" }} />
        <div style={{ position: "absolute", top: "68%", left: "-8%", width: "116%", height: "2px", background: "linear-gradient(90deg, transparent, rgba(236,72,153,0.28), rgba(124,58,237,0.28), transparent)", transform: "rotate(4deg)", filter: "blur(4px)" }} />
        <div style={{
          backgroundColor: "rgba(20,20,60,0.45)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: "24px",
          padding: "48px 44px", maxWidth: "440px", width: "100%",
          display: "flex", flexDirection: "column", gap: "22px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          position: "relative", zIndex: 1,
        }}>
          {children}
        </div>
      </div>
    );
  }

  // minimal (default)
  return (
    <div style={{
      padding: "80px 40px", display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "560px", backgroundColor: "#F8FAFC",
      backgroundImage: `radial-gradient(ellipse at 65% 8%, ${accentColor}0D 0%, transparent 55%)`,
    }}>
      <div style={{
        backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px",
        padding: "44px 40px", maxWidth: "420px", width: "100%",
        display: "flex", flexDirection: "column", gap: "22px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── LiveAuthForm ─────────────────────────────────────────────────────────────

function LiveAuthForm({ element }: AuthFormProps) {
  const mode = element.type === "auth-signup-form" ? "signup" : "signin";
  const variant: AuthVariant = (element.props?.variant as AuthVariant) || "minimal";
  const accentColor = (element.props?.accentColor as string) || "#6366F1";
  const showSocial = element.props?.showSocialLogin !== false;
  const redirectTo = (element.props?.redirectTo as string) || "";

  const heading = (element.props?.heading as string) || (mode === "signin" ? "Welcome back" : "Create your account");
  const subheading = (element.props?.subheading as string) || (mode === "signin" ? "Sign in to continue to your account" : "Join thousands of users — it's free");
  const buttonText = (element.props?.buttonText as string) || (mode === "signin" ? "Sign in" : "Create account");

  const { signIn, signUp, signInWithProvider, user, loading, error, clearError, authConfig } = useSiteAuth();
  const { addToast } = useToast();
  const t = TOKENS[variant];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });

  if (user) {
    return (
      <FormShell variant={variant} accentColor={accentColor}>
        <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${accentColor}, ${accentColor}BB)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 24px ${accentColor}44` }}>
            {user.avatarUrl
              ? <img src={user.avatarUrl} alt={user.name || user.email} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }} />
              : <span style={{ fontSize: "24px", fontWeight: 700, color: "#FFF" }}>{(user.name || user.email).charAt(0).toUpperCase()}</span>}
          </div>
          <div>
            <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: "18px", color: t.text }}>{user.name || "Welcome back"}</p>
            <p style={{ margin: 0, fontSize: "13px", color: t.muted }}>{user.email}</p>
          </div>
          <div style={{ padding: "6px 16px", borderRadius: "100px", backgroundColor: accentColor + "18", border: `1px solid ${accentColor}30`, fontSize: "13px", color: accentColor, fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            {Icons.check(accentColor)} Signed in
          </div>
        </div>
      </FormShell>
    );
  }

  if (success) {
    return (
      <FormShell variant={variant} accentColor={accentColor}>
        <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${accentColor}, ${accentColor}BB)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icons.mail("#FFFFFF")}
          </div>
          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "20px", color: t.text }}>Check your inbox</p>
            <p style={{ margin: 0, fontSize: "14px", color: t.muted, lineHeight: 1.6 }}>{successMsg}</p>
          </div>
        </div>
      </FormShell>
    );
  }

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (mode === "signup" && !name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) errs.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim())) errs.email = "Please enter a valid email address.";
    if (!password) errs.password = "Password is required.";
    else if (mode === "signup" && password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (mode === "signup" && password && confirmPassword !== password) errs.confirmPassword = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      addToast(Object.values(errs)[0], "warning");
      return;
    }
    setFieldErrors({});
    try {
      if (mode === "signin") {
        await signIn(email, password);
        addToast("Welcome back! Signed in successfully.", "success");
        if (redirectTo) window.location.href = redirectTo;
      } else {
        await signUp(email, password, name || undefined);
        addToast("Account created! Please check your email to verify.", "success");
        if (redirectTo) {
          window.location.href = redirectTo;
        } else {
          setSuccessMsg("We sent you a confirmation link. Please check your email.");
          setSuccess(true);
        }
      }
    } catch {
      if (error) addToast(error, "error");
    }
  };

  const notConfigured = !authConfig?.enabled || authConfig.provider === "none";
  const allowedProviders = authConfig?.allowedProviders ?? ["email"];
  const hasGoogle = showSocial && allowedProviders.includes("google") && !notConfigured;
  const hasGithub = showSocial && allowedProviders.includes("github") && !notConfigured;
  const hasSocial = hasGoogle || hasGithub;
  const hasEmail = allowedProviders.includes("email") || !allowedProviders.length;

  return (
    <FormShell variant={variant} accentColor={accentColor}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: t.text, letterSpacing: "-0.03em", lineHeight: 1.2 }}>{heading}</h2>
        <p style={{ margin: 0, fontSize: "14px", color: t.muted, lineHeight: 1.55 }}>{subheading}</p>
      </div>

      {notConfigured && (
        <div style={{ padding: "12px 14px", backgroundColor: "#FFFBEB", borderRadius: "10px", border: "1px solid #FDE68A", fontSize: "13px", color: "#92400E", display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Auth is not configured. Set up your provider in the Auth panel.
        </div>
      )}

      {hasSocial && <SocialButtons variant={variant} hasGoogle={hasGoogle} hasGithub={hasGithub} onGoogle={() => signInWithProvider("google")} onGithub={() => signInWithProvider("github")} />}
      {hasSocial && hasEmail && <Divider variant={variant} />}

      {hasEmail && (
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "signup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: t.labelColor }}>Full name</label>
              <TextInput type="text" value={name} onChange={v => { setName(v); clearFieldError("name"); }} placeholder="Jane Smith" hasError={!!fieldErrors.name} variant={variant} icon={Icons.user(t.muted)} accentColor={accentColor} />
              <FieldError msg={fieldErrors.name} />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: t.labelColor }}>Email address</label>
            <TextInput type="email" value={email} onChange={v => { setEmail(v); clearFieldError("email"); }} placeholder="you@example.com" hasError={!!fieldErrors.email} variant={variant} icon={Icons.email(t.muted)} accentColor={accentColor} />
            <FieldError msg={fieldErrors.email} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: t.labelColor }}>Password</label>
              {mode === "signin" && <span style={{ fontSize: "12px", color: accentColor, cursor: "pointer", fontWeight: 600 }}>Forgot password?</span>}
            </div>
            <PasswordInput value={password} onChange={v => { setPassword(v); clearFieldError("password"); }} placeholder={mode === "signup" ? "Min. 8 characters" : "Enter your password"} hasError={!!fieldErrors.password} variant={variant} accentColor={accentColor} />
            <FieldError msg={fieldErrors.password} />
          </div>

          {mode === "signup" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: t.labelColor }}>Confirm password</label>
              <PasswordInput value={confirmPassword} onChange={v => { setConfirmPassword(v); clearFieldError("confirmPassword"); }} placeholder="Re-enter your password" hasError={!!fieldErrors.confirmPassword} variant={variant} accentColor={accentColor} />
              <FieldError msg={fieldErrors.confirmPassword} />
            </div>
          )}

          {error && (
            <div style={{ padding: "11px 14px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", fontSize: "13px", color: "#B91C1C", display: "flex", gap: "8px", alignItems: "flex-start" }}>
              {Icons.warn("#B91C1C")}
              {error}
            </div>
          )}

          <SubmitButton text={buttonText} loading={loading} disabled={notConfigured} accentColor={accentColor} />

          {mode === "signup" && (
            <p style={{ margin: 0, fontSize: "11px", color: t.muted, textAlign: "center", lineHeight: 1.55 }}>
              By creating an account you agree to our{" "}
              <span style={{ color: accentColor, cursor: "pointer" }}>Terms of Service</span> and{" "}
              <span style={{ color: accentColor, cursor: "pointer" }}>Privacy Policy</span>.
            </p>
          )}
        </form>
      )}

      <p style={{ margin: 0, textAlign: "center", fontSize: "13px", color: t.muted }}>
        {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
        <span style={{ color: accentColor, fontWeight: 700, cursor: "pointer" }} onClick={() => { const h = element.props?.switchHref as string | undefined; if (h) window.location.href = h; }}>
          {mode === "signin" ? "Create one →" : "Sign in →"}
        </span>
      </p>
    </FormShell>
  );
}

// ─── EditorPreview ────────────────────────────────────────────────────────────

function EditorPreview({ element }: AuthFormProps) {
  const mode = element.type === "auth-signup-form" ? "signup" : "signin";
  const variant: AuthVariant = (element.props?.variant as AuthVariant) || "minimal";
  const accentColor = (element.props?.accentColor as string) || "#6366F1";
  const heading = (element.props?.heading as string) || (mode === "signin" ? "Welcome back" : "Create your account");
  const subheading = (element.props?.subheading as string) || (mode === "signin" ? "Sign in to continue" : "Join thousands of users — it's free");
  const t = TOKENS[variant];
  const isDark = variant === "dark" || variant === "glass" || variant === "aurora";

  const fieldPreview = (icon: React.ReactNode, label: string) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: t.labelColor }}>{label}</span>
      <div style={{ height: "46px", borderRadius: "10px", border: `1.5px solid ${t.inputBorder}`, backgroundColor: t.inputBg, display: "flex", alignItems: "center", paddingLeft: "13px", gap: "0" }}>
        <span style={{ color: t.muted, display: "flex" }}>{icon}</span>
      </div>
    </div>
  );

  return (
    <FormShell variant={variant} accentColor={accentColor}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: t.text, letterSpacing: "-0.03em" }}>{heading}</h2>
        <p style={{ margin: 0, fontSize: "14px", color: t.muted }}>{subheading}</p>
      </div>

      {/* Social preview */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1, height: "44px", borderRadius: "10px", border: `1.5px solid ${isDark ? "rgba(255,255,255,0.14)" : "#E2E8F0"}`, backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#FFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span style={{ fontSize: "13px", fontWeight: 600, color: t.text }}>Google</span>
        </div>
        <div style={{ flex: 1, height: "44px", borderRadius: "10px", backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#24292E", border: isDark ? `1.5px solid rgba(255,255,255,0.14)` : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFF" }}>GitHub</span>
        </div>
      </div>

      <Divider variant={variant} />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mode === "signup" && fieldPreview(Icons.user(t.muted), "Full name")}
        {fieldPreview(Icons.email(t.muted), "Email address")}
        {fieldPreview(Icons.lock(t.muted), "Password")}
      </div>

      <div style={{ padding: "13px 20px", borderRadius: "10px", background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`, color: "#FFF", fontWeight: 700, fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: `0 4px 18px ${accentColor}44` }}>
        {mode === "signin" ? "Sign in" : "Create account"}
        {Icons.arrow("#FFFFFF")}
      </div>

      <div style={{ padding: "8px 14px", borderRadius: "8px", backgroundColor: isDark ? "rgba(99,102,241,0.12)" : "#EEF2FF", border: `1px solid ${isDark ? "rgba(99,102,241,0.25)" : "#C7D2FE"}`, fontSize: "12px", color: isDark ? "#818CF8" : "#4338CA", textAlign: "center" }}>
        🔒 Functional auth form — configure auth in the Auth panel
      </div>
    </FormShell>
  );
}

// ─── Forgot Password Form ─────────────────────────────────────────────────────

function LiveForgotPasswordForm({ element }: AuthFormProps) {
  const variant: AuthVariant = (element.props?.variant as AuthVariant) || "minimal";
  const accentColor = (element.props?.accentColor as string) || "#6366F1";
  const heading = (element.props?.heading as string) || "Forgot your password?";
  const subheading = (element.props?.subheading as string) || "Enter your email and we'll send a reset link.";
  const buttonText = (element.props?.buttonText as string) || "Send reset link";

  const { siteId, authConfig } = useSiteAuth();
  const { addToast } = useToast();
  const t = TOKENS[variant];
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) { setFieldError("Enter a valid email address."); return; }
    setFieldError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot", email, authConfig }),
      });
      const json = await res.json();
      if (!res.ok) addToast(json.error || "Something went wrong.", "error");
      else setSent(true);
    } catch {
      setSent(true); // show success even if network error to prevent email enumeration
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <FormShell variant={variant} accentColor={accentColor}>
        <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${accentColor}, ${accentColor}BB)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icons.mail("#FFFFFF")}
          </div>
          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "20px", color: t.text }}>Check your inbox</p>
            <p style={{ margin: 0, fontSize: "14px", color: t.muted, lineHeight: 1.6 }}>We sent a password reset link to <strong>{email}</strong>.</p>
          </div>
          <button type="button" onClick={() => { setSent(false); setEmail(""); }} style={{ fontSize: "13px", color: accentColor, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Try a different email
          </button>
        </div>
      </FormShell>
    );
  }

  return (
    <FormShell variant={variant} accentColor={accentColor}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: t.text, letterSpacing: "-0.03em" }}>{heading}</h2>
          <p style={{ margin: 0, fontSize: "14px", color: t.muted }}>{subheading}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: t.labelColor }}>Email address</label>
          <TextInput type="email" value={email} onChange={v => { setEmail(v); setFieldError(""); }} placeholder="you@example.com" hasError={!!fieldError} variant={variant} icon={Icons.email(!!fieldError ? "#F87171" : t.muted)} accentColor={accentColor} />
          {fieldError && <span style={{ fontSize: "12px", color: "#EF4444", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>{Icons.warn("#EF4444")}{fieldError}</span>}
        </div>
        <SubmitButton text={buttonText} loading={loading} disabled={false} accentColor={accentColor} />
      </form>
    </FormShell>
  );
}

// ─── Reset Password Form ──────────────────────────────────────────────────────

function LiveResetPasswordForm({ element }: AuthFormProps) {
  const variant: AuthVariant = (element.props?.variant as AuthVariant) || "minimal";
  const accentColor = (element.props?.accentColor as string) || "#6366F1";
  const heading = (element.props?.heading as string) || "Set new password";
  const subheading = (element.props?.subheading as string) || "Choose a strong password for your account.";
  const buttonText = (element.props?.buttonText as string) || "Update password";

  const { siteId, authConfig } = useSiteAuth();
  const { addToast } = useToast();
  const t = TOKENS[variant];
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) newErrors.confirm = "Passwords do not match.";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", password, authConfig }),
      });
      const json = await res.json();
      if (!res.ok) addToast(json.error || "Something went wrong.", "error");
      else setDone(true);
    } catch {
      addToast("Network error. Please try again.", "error");
    }
    setLoading(false);
  };

  if (done) {
    return (
      <FormShell variant={variant} accentColor={accentColor}>
        <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${accentColor}, ${accentColor}BB)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {Icons.check("#FFFFFF")}
          </div>
          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "20px", color: t.text }}>Password updated!</p>
            <p style={{ margin: 0, fontSize: "14px", color: t.muted }}>Your password has been changed. You can now sign in.</p>
          </div>
        </div>
      </FormShell>
    );
  }

  return (
    <FormShell variant={variant} accentColor={accentColor}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: t.text, letterSpacing: "-0.03em" }}>{heading}</h2>
          <p style={{ margin: 0, fontSize: "14px", color: t.muted }}>{subheading}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: t.labelColor }}>New password</label>
          <PasswordInput value={password} onChange={v => { setPassword(v); setErrors(p => ({ ...p, password: undefined })); }} placeholder="Min. 8 characters" hasError={!!errors.password} variant={variant} accentColor={accentColor} />
          {errors.password && <FieldError msg={errors.password} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: t.labelColor }}>Confirm password</label>
          <PasswordInput value={confirmPassword} onChange={v => { setConfirmPassword(v); setErrors(p => ({ ...p, confirm: undefined })); }} placeholder="Repeat your password" hasError={!!errors.confirm} variant={variant} accentColor={accentColor} />
          {errors.confirm && <FieldError msg={errors.confirm} />}
        </div>
        <SubmitButton text={buttonText} loading={loading} disabled={false} accentColor={accentColor} />
      </form>
    </FormShell>
  );
}

// ─── Editor previews for forgot/reset ────────────────────────────────────────

function EditorPreviewForgot({ element }: AuthFormProps) {
  const variant: AuthVariant = (element.props?.variant as AuthVariant) || "minimal";
  const accentColor = (element.props?.accentColor as string) || "#6366F1";
  const heading = (element.props?.heading as string) || "Forgot your password?";
  const subheading = (element.props?.subheading as string) || "Enter your email and we'll send a reset link.";
  const t = TOKENS[variant];
  const isDark = variant === "dark" || variant === "glass" || variant === "aurora";

  const fieldPreview = (icon: React.ReactNode, placeholder: string) => (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <span style={{ position: "absolute", left: "13px", display: "flex", color: t.muted, pointerEvents: "none" }}>{icon}</span>
      <div style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "10px", border: `1.5px solid ${t.inputBorder}`, backgroundColor: t.inputBg, fontSize: "14px", color: t.muted }}>{placeholder}</div>
    </div>
  );

  return (
    <FormShell variant={variant} accentColor={accentColor}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: t.text, letterSpacing: "-0.03em" }}>{heading}</h2>
        <p style={{ margin: 0, fontSize: "14px", color: t.muted }}>{subheading}</p>
      </div>
      {fieldPreview(Icons.email(t.muted), "Email address")}
      <div style={{ padding: "13px 20px", borderRadius: "10px", background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`, color: "#FFF", fontWeight: 700, fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: `0 4px 18px ${accentColor}44` }}>
        Send reset link {Icons.arrow("#FFFFFF")}
      </div>
      <div style={{ padding: "8px 14px", borderRadius: "8px", backgroundColor: isDark ? "rgba(99,102,241,0.12)" : "#EEF2FF", border: `1px solid ${isDark ? "rgba(99,102,241,0.25)" : "#C7D2FE"}`, fontSize: "12px", color: isDark ? "#818CF8" : "#4338CA", textAlign: "center" }}>
        🔑 Forgot password form — configure auth in the Auth panel
      </div>
    </FormShell>
  );
}

function EditorPreviewReset({ element }: AuthFormProps) {
  const variant: AuthVariant = (element.props?.variant as AuthVariant) || "minimal";
  const accentColor = (element.props?.accentColor as string) || "#6366F1";
  const heading = (element.props?.heading as string) || "Set new password";
  const subheading = (element.props?.subheading as string) || "Choose a strong password for your account.";
  const t = TOKENS[variant];
  const isDark = variant === "dark" || variant === "glass" || variant === "aurora";

  const fieldPreview = (icon: React.ReactNode, placeholder: string) => (
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <span style={{ position: "absolute", left: "13px", display: "flex", color: t.muted, pointerEvents: "none" }}>{icon}</span>
      <span style={{ position: "absolute", right: "12px", display: "flex", color: t.muted }}>{Icons.eye(t.muted)}</span>
      <div style={{ width: "100%", padding: "12px 44px 12px 42px", borderRadius: "10px", border: `1.5px solid ${t.inputBorder}`, backgroundColor: t.inputBg, fontSize: "14px", color: t.muted }}>{placeholder}</div>
    </div>
  );

  return (
    <FormShell variant={variant} accentColor={accentColor}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: t.text, letterSpacing: "-0.03em" }}>{heading}</h2>
        <p style={{ margin: 0, fontSize: "14px", color: t.muted }}>{subheading}</p>
      </div>
      {fieldPreview(Icons.lock(t.muted), "New password")}
      {fieldPreview(Icons.lock(t.muted), "Confirm password")}
      <div style={{ padding: "13px 20px", borderRadius: "10px", background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`, color: "#FFF", fontWeight: 700, fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: `0 4px 18px ${accentColor}44` }}>
        Update password {Icons.arrow("#FFFFFF")}
      </div>
      <div style={{ padding: "8px 14px", borderRadius: "8px", backgroundColor: isDark ? "rgba(99,102,241,0.12)" : "#EEF2FF", border: `1px solid ${isDark ? "rgba(99,102,241,0.25)" : "#C7D2FE"}`, fontSize: "12px", color: isDark ? "#818CF8" : "#4338CA", textAlign: "center" }}>
        🔒 Reset password form — configure auth in the Auth panel
      </div>
    </FormShell>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function AuthFormRenderer({ element }: AuthFormProps) {
  const isPreview = useIsPreview();
  if (element.type === "auth-forgot-form") {
    return isPreview ? <LiveForgotPasswordForm element={element} /> : <EditorPreviewForgot element={element} />;
  }
  if (element.type === "auth-reset-form") {
    return isPreview ? <LiveResetPasswordForm element={element} /> : <EditorPreviewReset element={element} />;
  }
  if (!isPreview) return <EditorPreview element={element} />;
  return <LiveAuthForm element={element} />;
}
