import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { sendTeamInviteEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { email, role } = await req.json();
    if (!email || !role) return NextResponse.json({ error: "email and role are required" }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data, error } = await admin.from("team_invites").insert({
      email,
      role,
      invited_by: user.id,
      owner_id: user.id,
      status: "pending",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logActivity({
      user_id: user.id,
      owner_id: user.id,
      action_type: "team",
      description: `Invited ${email} as ${role}`,
      metadata: { email, role },
    });

    // Send invite email (non-blocking)
    try {
      const { data: inviter } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", user.id)
        .single();
      const inviterName = inviter?.name ?? inviter?.email ?? "A team member";
      await sendTeamInviteEmail(email, inviterName, role, data.id);
    } catch (emailErr) {
      // Email failure should not block invite creation
      console.error("Failed to send invite email:", emailErr);
    }

    return NextResponse.json({ invite: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const inviteId = searchParams.get("inviteId");
  if (!inviteId) return NextResponse.json({ error: "inviteId is required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("team_invites")
    .delete()
    .eq("id", inviteId)
    .eq("owner_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  // Resend = update expires_at to 7 days from now, keep status pending
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { inviteId } = await req.json();
    if (!inviteId) return NextResponse.json({ error: "inviteId is required" }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await admin
      .from("team_invites")
      .update({ expires_at: newExpiry, status: "pending" })
      .eq("id", inviteId)
      .eq("owner_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
