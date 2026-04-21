import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const admin = createSupabaseAdminClient();
      const user = data.user;

      // 1. Ensure a profile row exists in the users table.
      //    OAuth sign-ins skip the email/password signup flow so there is no
      //    DB trigger to rely on — we must upsert here.
      try {
        const meta = user.user_metadata ?? {};
        const email = user.email ?? meta.email ?? "";
        const name: string =
          meta.full_name ?? meta.name ?? email.split("@")[0] ?? "User";
        const avatarUrl: string | null = meta.avatar_url ?? meta.picture ?? null;

        await admin.from("users").upsert(
          {
            id: user.id,
            email,
            name,
            avatar_url: avatarUrl,
            plan: "free",
            ai_credits_used: 0,
            ai_credits_limit: 0,
            onboarding_completed: false,
          },
          { onConflict: "id", ignoreDuplicates: true }
        );
      } catch {
        // Non-blocking — profile already exists or will be created by trigger
      }

      // 2. Ensure the user has at least one workspace.
      try {
        const { data: existing } = await admin
          .from("teams")
          .select("id")
          .eq("owner_id", user.id)
          .limit(1)
          .maybeSingle();

        if (!existing) {
          const { data: team } = await admin
            .from("teams")
            .insert({ name: "My Workspace", created_by: user.id, owner_id: user.id })
            .select()
            .single();

          if (team) {
            await admin.from("team_members").insert({
              team_id: team.id,
              user_id: user.id,
              role: "owner",
            });
          }
        }
      } catch {
        // Non-blocking
      }

      const safeNext = next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
