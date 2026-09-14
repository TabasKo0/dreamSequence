import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelThreeClient from "./LevelThreeClient";

export default async function LevelThreePage() {
  const { team } = await enforceLevelAccess("Level 3");

  const supabase = await createClient();
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points")
    .eq("game_level", 'Level 3')
    .eq("flag_number", team.current_flag)
    .maybeSingle();

  if (!challenge) {
    console.error("Sending 404 because challenge was not found. Supabase error:", error);
    notFound();
  }

  return <LevelThreeClient challenge={challenge} />;
}
