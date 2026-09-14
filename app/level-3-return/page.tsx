import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelThreeReturnClient from "./LevelThreeReturnClient";

export default async function LevelThreeReturnPage() {
  const { team } = await enforceLevelAccess("Level 3 (Ascending)");

  const supabase = await createClient();
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points")
    //.eq("game_level", 'Level 3 Return')
    .eq("flag_number", team.current_flag)
    .maybeSingle();

  if (!challenge) {
    const { data: altChallenge } = await supabase
      .from("challenges")
      .select("flag_number, game_level, title, category, description, points")
      //.eq("game_level", 'Level 3 (Ascending)')
      .eq("flag_number", team.current_flag)
      .maybeSingle();
      
    if (!altChallenge) notFound();
    return <LevelThreeReturnClient challenge={altChallenge} />;
  }

  return <LevelThreeReturnClient challenge={challenge} />;
}
