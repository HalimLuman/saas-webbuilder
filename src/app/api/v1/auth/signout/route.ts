import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * POST /api/v1/auth/signout
 *
 * Server-side sign-out. Calling supabase.auth.signOut() here ensures the
 * HTTP-only session cookies that the middleware sets are properly expired
 * in the response. A pure client-side signOut() call cannot clear those
 * cookies, leaving the user accessible even after clearing browser storage.
 */
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  const origin = new URL(req.url).origin;
  const response = NextResponse.redirect(`${origin}/login`, { status: 302 });

  // Belt-and-suspenders: explicitly expire the known Supabase cookie names
  // so they are gone even if the SSR client missed any edge case.
  const cookieNames = [
    "sb-access-token",
    "sb-refresh-token",
    `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0]}-auth-token`,
  ];
  for (const name of cookieNames) {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  }

  return response;
}
