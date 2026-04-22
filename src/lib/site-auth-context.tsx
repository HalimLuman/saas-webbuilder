"use client";

/**
 * SiteAuthContext
 *
 * Manages authentication state for a *published / preview* site.
 * Completely separate from the Webperia builder auth (Supabase owner auth).
 *
 * Session is persisted in localStorage under the key:
 *   `bs_site_auth_<siteId>`
 *
 * The context is provided by <SiteAuthProvider> which is mounted inside the
 * canvas wrapper so all rendered elements (navbars, auth forms) share it.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { SiteAuthConfig } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteAuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface StoredSession {
  user: SiteAuthUser;
  accessToken: string;
  expiresAt: number; // unix ms
}

interface SiteAuthContextValue {
  user: SiteAuthUser | null;
  loading: boolean;
  error: string | null;
  authConfig: SiteAuthConfig | null;
  siteId: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithProvider: (provider: "google" | "github") => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SiteAuthContext = createContext<SiteAuthContextValue>({
  user: null,
  loading: false,
  error: null,
  authConfig: null,
  siteId: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithProvider: async () => {},
  signOut: async () => {},
  clearError: () => {},
});

export function useSiteAuth() {
  return useContext(SiteAuthContext);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function storageKey(siteId: string) {
  return `bs_site_auth_${siteId}`;
}

function readSession(siteId: string): StoredSession | null {
  try {
    const raw = localStorage.getItem(storageKey(siteId));
    if (!raw) return null;
    const parsed: StoredSession = JSON.parse(raw);
    // Discard expired sessions
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(storageKey(siteId));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(siteId: string, session: StoredSession) {
  localStorage.setItem(storageKey(siteId), JSON.stringify(session));
}

function clearSession(siteId: string) {
  localStorage.removeItem(storageKey(siteId));
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface SiteAuthProviderProps {
  siteId: string;
  authConfig: SiteAuthConfig | null | undefined;
  navigate?: (slug: string) => void;
  children: React.ReactNode;
}

export function SiteAuthProvider({ siteId, authConfig, navigate, children }: SiteAuthProviderProps) {
  const [user, setUser] = useState<SiteAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const session = readSession(siteId);
    if (session) setUser(session.user);
    setLoading(false);
  }, [siteId]);

  const clearError = useCallback(() => setError(null), []);

  // ── signIn ──────────────────────────────────────────────────────────────────

  const signIn = useCallback(async (email: string, password: string) => {
    if (!authConfig?.enabled || authConfig.provider === "none") {
      throw new Error("Authentication is not configured for this site.");
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signin", email, password, authConfig }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sign in failed");
      const session: StoredSession = {
        user: json.user,
        accessToken: json.accessToken,
        expiresAt: json.expiresAt ?? Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      writeSession(siteId, session);
      setUser(session.user);
      if (authConfig?.redirectAfterSignIn) navigate?.(authConfig.redirectAfterSignIn);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authConfig, siteId, navigate]);

  // ── signUp ──────────────────────────────────────────────────────────────────

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    if (!authConfig?.enabled || authConfig.provider === "none") {
      throw new Error("Authentication is not configured for this site.");
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", email, password, name, authConfig }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sign up failed");
      // Some providers (e.g. Supabase email confirmation) return no session immediately
      if (json.accessToken) {
        const session: StoredSession = {
          user: json.user,
          accessToken: json.accessToken,
          expiresAt: json.expiresAt ?? Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        writeSession(siteId, session);
        setUser(session.user);
        if (authConfig?.redirectAfterSignIn) navigate?.(authConfig.redirectAfterSignIn);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authConfig, siteId, navigate]);

  // ── signInWithProvider ───────────────────────────────────────────────────────

  const signInWithProvider = useCallback(async (provider: "google" | "github") => {
    if (!authConfig?.enabled || authConfig.provider === "none") {
      throw new Error("Authentication is not configured for this site.");
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "oauth", provider, authConfig }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "OAuth sign-in failed");
      // OAuth typically returns a redirect URL
      if (json.redirectUrl) {
        window.location.href = json.redirectUrl;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "OAuth sign-in failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [authConfig, siteId]);

  // ── signOut ──────────────────────────────────────────────────────────────────

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const session = readSession(siteId);
      if (session) {
        await fetch(`/api/v1/sites/${siteId}/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ action: "signout" }),
        }).catch(() => {}); // best-effort — still clear locally
      }
    } finally {
      clearSession(siteId);
      setUser(null);
      setLoading(false);
      if (authConfig?.redirectAfterSignOut) navigate?.(authConfig.redirectAfterSignOut);
    }
  }, [siteId, authConfig, navigate]);

  return (
    <SiteAuthContext.Provider value={{
      user,
      loading,
      error,
      authConfig: authConfig ?? null,
      siteId,
      signIn,
      signUp,
      signInWithProvider,
      signOut,
      clearError,
    }}>
      {children}
    </SiteAuthContext.Provider>
  );
}
