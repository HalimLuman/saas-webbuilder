import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";

  // Detect subdomain: anything before the root domain that isn't the root itself.
  // Works for both production (mysite.buildstack.site) and local dev (mysite.localhost:3000).
  const isSubdomain =
    hostname !== ROOT_DOMAIN &&
    (hostname.endsWith(`.${ROOT_DOMAIN}`) ||
      // support *.localhost (no port) for local dev with e.g. /etc/hosts
      (/^[^.]+\.localhost(:\d+)?$/.test(hostname) && !hostname.startsWith("www.")));

  if (isSubdomain) {
    const slug = hostname.split(".")[0];
    const url = request.nextUrl.clone();
    // Preserve the original path so /about → /_sites/mysite/about
    const originalPath = url.pathname === "/" ? "" : url.pathname;
    url.pathname = `/_sites/${slug}${originalPath}`;
    return NextResponse.rewrite(url);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
