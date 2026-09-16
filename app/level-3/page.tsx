import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelThreeClient from "./LevelThreeClient";

export default async function LevelThreePage() {
  const { team } = await enforceLevelAccess("Level 3");

  const supabase = await createClient();
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points, link")
    .order("flag_number", { ascending: true });

  if (!challenges || challenges.length === 0) {
    console.error("Sending 404 because challenges were not found. Supabase error:", error, team.current_flag);
    notFound();
  }

  return <LevelThreeClient challenges={challenges} team={team} />;
}
