import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const PUBLIC_ROUTES = [
  "/",
  "/pricing",
  "/templates",
  "/blog",
  "/changelog",
  "/login",
  "/signup",
  "/auth",
  "/api/webhooks",
  // Published sites served via subdomain rewrite — no auth required
  "/_sites",
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/") || pathname.startsWith(r + "?")
  );
}

// Rate-limit rules: [pattern, maxRequests, windowMs]
const RATE_LIMIT_RULES: Array<[RegExp, number, number]> = [
  [/^\/api\/v1\/ai(\/|$)/, 20, 60_000],
  [/^\/api\/v1\/stripe(\/|$)/, 30, 60_000],
  [/^\/api\/v1\/forms\/[^/]+\/submit(\/|$)/, 5, 60_000],
  [/^\/(auth\/)?(login|signup)(\/|$)/, 10, 60_000],
];

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.ip ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";

  for (const [pattern, limit, windowMs] of RATE_LIMIT_RULES) {
    if (pattern.test(pathname)) {
      const result = rateLimit(`${ip}:${pattern.source}`, limit, windowMs);
      if (!result.success) {
        const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
        return NextResponse.json(rateLimitResponse(result.reset), {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        });
      }
      break; // apply only the first matching rule
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — do NOT remove this line
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  if (!user && !isPublicRoute(pathname)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  // For dashboard routes: verify the user's profile row still exists.
  // This catches the case where auth.users still has a valid JWT but the
  // application `users` table row has been deleted (e.g. after a DB wipe).
  if (user && pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      // Sign out server-side (clears HTTP-only cookies) then send to login
      await supabase.auth.signOut();
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      const redirectResponse = NextResponse.redirect(loginUrl);
      // Expire session cookies explicitly
      redirectResponse.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
      redirectResponse.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });
      return redirectResponse;
    }
  }

  return supabaseResponse;
}
