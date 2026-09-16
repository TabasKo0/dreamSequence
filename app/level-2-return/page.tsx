import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelTwoReturnClient from "./LevelTwoReturnClient";

export default async function LevelTwoReturnPage() {
  const { team } = await enforceLevelAccess("level-2-return");

  const supabase = await createClient();
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points, link")
    //.eq("game_level", 'Level 2 Return')
    .eq("flag_number", team.current_flag)
    .maybeSingle();

  if (!challenge) {
    // If not found, try alternative name Level 2 (Ascending)
    const { data: altChallenge } = await supabase
      .from("challenges")
      .select("flag_number, game_level, title, category, description, points, link")
      //.eq("game_level", 'Level 2 (Ascending)')
      .eq("flag_number", team.current_flag)
      .maybeSingle();
      
    if (!altChallenge) notFound();
    return <LevelTwoReturnClient challenge={altChallenge} team={team} />;
  }

  return <LevelTwoReturnClient challenge={challenge} team={team} />;
}
