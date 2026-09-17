import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function enforceLevelAccess(requiredGameLevel: string) {
  const supabase = await createClient();
  
  // 1. Secure Session Check
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user || error) {
    redirect("/login");
  }

  // 2. Global CTF Settings Check (NEW)
  // Fetch the single configuration row to check global game state
  const { data: status } = await supabase
    .from("ctf_settings")
    .select("submissions_locked, is_active")
    .eq("id", 1)
    .single();

  // If the event is paused (!is_active) or locked, kick the player to the dashboard
  if (!status?.is_active || status?.submissions_locked) {
    redirect("/dashboard");
  }

  // 3. Team Null Check
  const { data: profile } = await supabase
    .from("users")
    .select("team_id")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.team_id) {
    redirect("/dashboard");
  }

  // 4. Fetch Team Progress
  const { data: team } = await supabase
    .from("teams")
    .select("*, current_flag, game_level")
    .eq("id", profile.team_id)
    .single();

  if (!team) {
    redirect("/dashboard");
  }

  // 5. Strict Level Enforcement
  if (
    !team.game_level ||
    team.game_level.toLowerCase() !== requiredGameLevel.toLowerCase()
  ) {
    redirect("/dashboard");
  }

  return { user, team };
}

export async function enforceAdminAccess() {
  const supabase = await createClient();
  
  // 1. Secure Session Check
  const { data: { user }, error } = await supabase.auth.getUser();
  if (!user || error) {
    redirect("/login");
  }

  // 2. Admin Check
  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();
    
  if (!profile || profile.is_admin !== true) {
    redirect("/dashboard");
  }

  return user;
}