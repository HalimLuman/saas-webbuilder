import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { resolveWorkspace } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId");
  const range = searchParams.get("range") ?? "30d";

  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const admin = createSupabaseAdminClient();
  const ws = await resolveWorkspace(req, user.id);

  let query = admin
    .from("page_views")
    .select("page_path, referrer, country_code, device_type, created_at")
    .gte("created_at", since.toISOString());

  if (ws) {
    query = query.eq("team_id", ws.teamId);
  } else {
    query = query.eq("owner_id", user.id);
  }

  if (siteId) query = query.eq("site_id", siteId);

  const { data: views, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = views ?? [];

  const buckets: Record<string, { visitors: Set<string>; pageViews: number }> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().split("T")[0]] = { visitors: new Set(), pageViews: 0 };
  }

  const pathCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };

  rows.forEach((row) => {
    const day = row.created_at.split("T")[0];
    if (buckets[day]) {
      buckets[day].pageViews++;
      buckets[day].visitors.add(row.referrer ?? "anon-" + day);
    }
    if (row.page_path) pathCounts[row.page_path] = (pathCounts[row.page_path] ?? 0) + 1;
    if (row.referrer) {
      const src = row.referrer.replace(/^https?:\/\//, "").split("/")[0];
      referrerCounts[src] = (referrerCounts[src] ?? 0) + 1;
    }
    if (row.country_code) countryCounts[row.country_code] = (countryCounts[row.country_code] ?? 0) + 1;
    if (row.device_type) deviceCounts[row.device_type] = (deviceCounts[row.device_type] ?? 0) + 1;
  });

  const daily = Object.entries(buckets).map(([date, b]) => ({
    date,
    visitors: b.visitors.size,
    pageViews: b.pageViews,
    bounceRate: 45,
    avgDuration: 120,
  }));

  const totalPageViews = rows.length;
  const totalVisitors = daily.reduce((s, d) => s + d.visitors, 0);

  const topPages = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, visitors]) => ({ path, title: path === "/" ? "Home" : path.replace(/^\//, ""), visitors, bounceRate: 45 }));

  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([source, visitors]) => ({ source, label: source, visitors }));

  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, visitors]) => ({ code, name: code, visitors }));

  const totalDevice = Object.values(deviceCounts).reduce((s, v) => s + v, 1);
  const devicePct = {
    desktop: Math.round((deviceCounts.desktop / totalDevice) * 100),
    mobile:  Math.round((deviceCounts.mobile  / totalDevice) * 100),
    tablet:  Math.round((deviceCounts.tablet  / totalDevice) * 100),
  };

  return NextResponse.json({
    siteId: siteId ?? "all",
    range,
    summary: {
      visitors:    { value: totalVisitors,  change: 0 },
      pageViews:   { value: totalPageViews, change: 0 },
      bounceRate:  { value: 45,             change: 0 },
      avgDuration: { value: 120,            change: 0 },
    },
    daily,
    topPages,
    topReferrers,
    topCountries,
    devices: devicePct,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { site_id, owner_id, team_id, page_path, referrer, country_code, device_type } = body;
    if (!owner_id) return NextResponse.json({ error: "owner_id is required" }, { status: 400 });

    const admin = createSupabaseAdminClient();
    await admin.from("page_views").insert({
      site_id: site_id ?? null,
      owner_id,
      team_id: team_id ?? null,
      page_path: page_path ?? "/",
      referrer: referrer ?? null,
      country_code: country_code ?? null,
      device_type: device_type ?? null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
