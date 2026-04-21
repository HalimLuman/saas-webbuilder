import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("users")
      .select("id", { count: "exact", head: true });

    if (error) throw error;

    return NextResponse.json(
      {
        status: "ok",
        db: "ok",
        timestamp,
        uptime: process.uptime(),
        version: process.env.npm_package_version ?? "unknown",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: "degraded",
        db: "error",
        error: err instanceof Error ? err.message : "Unknown error",
        timestamp,
      },
      { status: 503 }
    );
  }
}
