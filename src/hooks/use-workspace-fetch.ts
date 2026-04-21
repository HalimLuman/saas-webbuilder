"use client";

import { useCallback } from "react";
import { useWorkspaceStore } from "@/store/workspace-store";

/**
 * Returns a `fetch`-compatible function that automatically injects the
 * `x-workspace-id` header from the active workspace in the global store.
 * Drop-in replacement for `fetch` in dashboard pages.
 */
export function useWorkspaceFetch() {
  const { activeWorkspaceId } = useWorkspaceStore();

  return useCallback(
    (url: string, options?: RequestInit): Promise<Response> => {
      const headers = new Headers(options?.headers);
      if (activeWorkspaceId) {
        headers.set("x-workspace-id", activeWorkspaceId);
      }
      return fetch(url, { ...options, headers });
    },
    [activeWorkspaceId]
  );
}
