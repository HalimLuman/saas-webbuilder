import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("deployments")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];

  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

  for (const d of rows) {
    if (d.status !== "building") continue;

    // No vercel_deployment_id = site was published to built-in hosting.
    // Mark as success so the client never sees a perpetual "Building" spinner.
    if (!d.vercel_deployment_id) {
      const now = d.finished_at ?? new Date().toISOString();
      const msg = "Published via built-in hosting. Connect Vercel to get an external URL.";

      // Update status first (always-present columns), then error_message separately
      // so a missing migration never blocks the status fix.
      await supabase
        .from("deployments")
        .update({ status: "success", finished_at: now })
        .eq("id", d.id);
      await supabase
        .from("deployments")
        .update({ error_message: msg } as never)
        .eq("id", d.id);

      // Mutate the in-memory row so the response is already correct.
      d.status = "success";
      d.finished_at = now;
      (d as Record<string, unknown>).error_message = msg;
      continue;
    }

    // Has a vercel_deployment_id — poll Vercel for live status.
    if (!VERCEL_TOKEN) continue;

    try {
      const url = `https://api.vercel.com/v13/deployments/${d.vercel_deployment_id}${
        VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ""
      }`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      });

      if (res.ok) {
        const vData = await res.json();
        let newStatus: string = "building";
        let errorMsg: string | null = null;

        if (vData.readyState === "READY") {
          newStatus = "success";
        } else if (vData.readyState === "ERROR") {
          newStatus = "failed";
          errorMsg =
            vData.errorMessage ??
            vData.error?.message ??
            "Vercel reported a build error. Check your Vercel dashboard for logs.";
        } else if (vData.readyState === "CANCELED") {
          newStatus = "failed";
          errorMsg = "Deployment was cancelled in Vercel.";
        }

        if (newStatus !== "building") {
          const now = new Date().toISOString();
          await supabase
            .from("deployments")
            .update({ status: newStatus, finished_at: now })
            .eq("id", d.id);
          if (errorMsg) {
            await supabase
              .from("deployments")
              .update({ error_message: errorMsg } as never)
              .eq("id", d.id);
          }

          d.status = newStatus;
          d.finished_at = now;
          if (errorMsg) (d as Record<string, unknown>).error_message = errorMsg;
        }
      } else {
        const errBody = await res.text().catch(() => "");
        console.error(
          `[deployments] Vercel status fetch failed for ${d.vercel_deployment_id}:`,
          res.status,
          errBody
        );
      }
    } catch (e) {
      console.error("[deployments] Error polling Vercel:", e);
    }
  }

  return NextResponse.json({ data: rows });
}
