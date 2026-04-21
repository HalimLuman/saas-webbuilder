"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  plan: "free" | "pro" | "business" | "enterprise";
  ai_credits_used: number;
  ai_credits_limit: number;
  stripe_customer_id: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

interface UserContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  profile: null,
  loading: true,
});

async function serverSignOut() {
  try {
    await fetch("/api/v1/auth/signout", { method: "POST" });
  } catch {
    // fallback: still redirect
  }
  window.location.replace("/login");
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Single Supabase client instance shared across the whole provider tree.
    const supabase = createSupabaseBrowserClient();

    async function loadUser() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (!data) {
          await serverSignOut();
          return;
        }

        setProfile(data as UserProfile);
      }

      setLoading(false);
    }

    loadUser();

    // ONE subscription for the entire provider tree — eliminates lock contention
    // that occurs when multiple useUser() calls each register their own listener.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
          setUser(null);
          setProfile(null);
          window.location.replace("/login");
          return;
        }

        setUser(session?.user ?? null);

        if (session?.user) {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!data) {
            await serverSignOut();
            return;
          }

          setProfile(data as UserProfile);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
