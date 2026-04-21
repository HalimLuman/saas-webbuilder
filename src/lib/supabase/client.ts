import { createBrowserClient } from "@supabase/ssr";

// Do NOT cache as a singleton — a cached instance holds session state in memory
// even after the user clears browser storage, making it impossible to force a
// clean logout by clearing cookies/localStorage from DevTools.
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
