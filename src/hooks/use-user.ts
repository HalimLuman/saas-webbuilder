"use client";

// Re-export from the central UserContext so all callers share one subscription.
export type { UserProfile } from "@/lib/user-context";
export { useUserContext as useUser } from "@/lib/user-context";
