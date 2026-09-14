import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function enforceLevelAccess(requiredGameLevel: string) {
  const supabase = await createClient();
  
  // 1. Secure Session Check
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user || error) {
    redirect("/login");
  }

  // 2. Team Null Check
  const { data: profile } = await supabase
    .from("users")
    .select("team_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.team_id) {
    redirect("/dashboard");
  }

  // 3. Fetch Team Progress
  const { data: team } = await supabase
    .from("teams")
    .select("*, current_flag, game_level")
    .eq("id", profile.team_id)
    .single();

  if (!team) {
    redirect("/dashboard");
  }

  // 4. Strict Level Enforcement
  if (
    !team.game_level ||
    team.game_level.toLowerCase() !== requiredGameLevel.toLowerCase()
  ) {
    redirect("/dashboard");
  }

  return { user, team };
}
