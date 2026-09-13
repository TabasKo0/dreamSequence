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

  // Circuit Breaker: if they are requesting their current level, allow immediate access
  if (team.game_level && requiredGameLevel.toLowerCase() === team.game_level.toLowerCase()) {
    return { user, team };
  }

  // 4. Anti-Skip Rule based on Narrative Flags
  const { data: challenges } = await supabase
    .from("challenges")
    .select("game_level")
    .lte("flag_number", team.current_flag);

  const unlockedLevels = challenges ? challenges.map(c => (c.game_level || "").toLowerCase()) : [];

  if (!unlockedLevels.includes(requiredGameLevel.toLowerCase())) {
    const slug = (team.game_level || 'Reality').toLowerCase().replace(/ /g, '-');
    redirect(`/${slug}`);
  }

  return { user, team };
}
