import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelOneClient from "./LevelOneClient";

export default async function LevelOnePage() {
  const { team } = await enforceLevelAccess("Level 1");

  const supabase = await createClient();
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points, link")
    .order("flag_number", { ascending: true });

  if (!challenges || challenges.length === 0) {
    console.error("Sending 404 because challenges were not found. Supabase error:", error, team.current_flag);
    notFound();
  }

  return <LevelOneClient challenges={challenges} team={team} />;
}
