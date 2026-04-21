import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export type WorkspaceRole = "owner" | "admin" | "designer" | "editor" | "viewer";

export interface WorkspaceContext {
  teamId: string;
  role: WorkspaceRole;
}

/**
 * Reads `x-workspace-id` from request headers, verifies the given userId is a
 * member (or owner) of that workspace, and returns the teamId + role.
 *
 * Returns null if the header is missing or the user has no access.
 */
export async function resolveWorkspace(
  req: NextRequest,
  userId: string
): Promise<WorkspaceContext | null> {
  const teamId = req.headers.get("x-workspace-id");
  if (!teamId) return null;

  const admin = createSupabaseAdminClient();

  // Fast owner check
  const { data: team } = await admin
    .from("teams")
    .select("owner_id")
    .eq("id", teamId)
    .maybeSingle();

  if (!team) return null;
  if (team.owner_id === userId) return { teamId, role: "owner" };

  const { data: membership } = await admin
    .from("team_members")
    .select("role")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) return null;
  return { teamId, role: membership.role as WorkspaceRole };
}
