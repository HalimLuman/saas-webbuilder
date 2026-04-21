import { createSupabaseAdminClient } from "@/lib/supabase/server";

type ActionType = "publish" | "edit" | "team" | "billing" | "deploy_failed" | "create" | "delete";

export async function logActivity(opts: {
  user_id: string;
  owner_id: string;
  team_id?: string;
  action_type: ActionType;
  description: string;
  site_id?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const admin = createSupabaseAdminClient();
    await admin.from("activity_logs").insert({
      user_id: opts.user_id,
      owner_id: opts.owner_id,
      team_id: opts.team_id ?? null,
      action_type: opts.action_type,
      description: opts.description,
      site_id: opts.site_id ?? null,
      metadata: opts.metadata ?? {},
    });
  } catch {
    // Non-fatal — activity logging should never break the main request
  }
}
