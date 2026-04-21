"use client";

import { useEffect } from "react";
import { useSiteStore } from "@/store/site-store";
import { useWorkspaceStore } from "@/store/workspace-store";

/**
 * Rehydrates Zustand persist stores from localStorage after the first client
 * render. Both stores use `skipHydration: true` so the server renders with
 * their empty initial state — eliminating the SSR/client HTML mismatch that
 * causes React hydration errors.
 *
 * Mount this once, high in the client tree (e.g. the dashboard layout).
 */
export function StoreHydrator() {
  useEffect(() => {
    useSiteStore.persist.rehydrate();
    useWorkspaceStore.persist.rehydrate();
  }, []);

  return null;
}
