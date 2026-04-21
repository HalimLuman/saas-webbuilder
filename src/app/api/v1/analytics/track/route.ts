import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

// POST /api/v1/analytics/track
// Public endpoint — no auth required for page view tracking
export async function POST(req: NextRequest) {
  try {
    const { siteId, ownerId, pagePath, referrer } = await req.json();
    if (!siteId || !pagePath) {
      return NextResponse.json({ error: "siteId and pagePath are required" }, { status: 400 });
    }

    // Detect device type from User-Agent
    const ua = req.headers.get("user-agent") ?? "";
    let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
    if (/mobile/i.test(ua) && !/tablet|ipad/i.test(ua)) deviceType = "mobile";
    else if (/tablet|ipad/i.test(ua)) deviceType = "tablet";

    // Country from Vercel/Cloudflare geo headers (graceful fallback)
    const countryCode =
      req.headers.get("x-vercel-ip-country") ??
      req.headers.get("cf-ipcountry") ??
      null;

    const admin = createSupabaseAdminClient();
    await admin.from("page_views").insert({
      site_id: siteId,
      owner_id: ownerId ?? null,
      page_path: pagePath,
      referrer: referrer ?? null,
      country_code: countryCode,
      device_type: deviceType,
    });

    return NextResponse.json({ tracked: true });
  } catch (err) {
    // Never throw on tracking failure — silently fail
    return NextResponse.json({ tracked: false });
  }
}
