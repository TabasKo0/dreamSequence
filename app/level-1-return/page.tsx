import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelOneReturnClient from "./LevelOneReturnClient";

export default async function LevelOneReturnPage() {
  const { team } = await enforceLevelAccess("level-1-return");

  const supabase = await createClient();
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points, link")
    .eq("flag_number", team.current_flag)
    .maybeSingle();

  if (!challenge) {
    const { data: altChallenge } = await supabase
      .from("challenges")
      .select("flag_number, game_level, title, category, description, points, link")
      //.eq("game_level", 'Level 1 Return')
      .eq("flag_number", team.current_flag)
      .maybeSingle();
      
    if (!altChallenge) notFound();
    return <LevelOneReturnClient challenge={altChallenge} team={team} />;
  }

  return <LevelOneReturnClient challenge={challenge} team={team} />;
}
