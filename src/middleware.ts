import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "webperia.com";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // 1. Get the hostname (e.g., www.webperia.com, webperia.com, or tenant.webperia.com)
  const hostname = request.headers.get("host")?.toLowerCase() ?? "";

  // 2. Define the "searchDomain" by removing www. 
  // This helps us identify if we are on the main site.
  const searchDomain = hostname.replace("www.", "");

  // 3. Detect if this is a subdomain (tenant) site
  // It is a subdomain if it ends with .ROOT_DOMAIN and is NOT the root domain itself
  // and is NOT just the "www" prefix.
  const isSubdomain =
    hostname.endsWith(`.${ROOT_DOMAIN}`) &&
    hostname !== `www.${ROOT_DOMAIN}`;

  if (isSubdomain) {
    // Extract the slug (e.g., "mysite" from "mysite.webperia.com")
    const slug = hostname.split(".")[0];

    // Preserve the original path so /about → /tenant/mysite/about
    const originalPath = url.pathname === "/" ? "" : url.pathname;

    const rewriteUrl = new URL(`/tenant/${slug}${originalPath}`, request.url);
    return NextResponse.rewrite(rewriteUrl);
  }

  // 4. Special Case: Localhost Subdomain Development
  // This allows "mysite.localhost:3000" to work during local testing
  if (process.env.NODE_ENV === "development" && hostname.includes(".localhost")) {
    const slug = hostname.split(".")[0];
    if (slug !== "localhost") {
      const originalPath = url.pathname === "/" ? "" : url.pathname;
      const rewriteUrl = new URL(`/tenant/${slug}${originalPath}`, request.url);
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // 5. Default: Main Site (webperia.com or www.webperia.com)
  // We update the session and let the request proceed to your normal page routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones provided below:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - all images/assets (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};