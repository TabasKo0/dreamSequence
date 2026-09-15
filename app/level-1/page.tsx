import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelOneClient from "./LevelOneClient";

export default async function LevelOnePage() {
  const { team } = await enforceLevelAccess("Level 1");

  const supabase = await createClient();
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points, link")
    //.eq("game_level", 'Level 1')
    .eq("flag_number", team.current_flag)
    .maybeSingle();

  if (!challenge) {
    console.error("Sending 404 because challenge was not found. Supabase error:", error);
    notFound();
  }

  return <LevelOneClient challenge={challenge} />;
}
