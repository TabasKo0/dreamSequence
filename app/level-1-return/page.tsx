import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelOneReturnClient from "./LevelOneReturnClient";

export default async function LevelOneReturnPage() {
  const { team } = await enforceLevelAccess("level-1-return");

  const supabase = await createClient();
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points, link")
    .order("flag_number", { ascending: true });

  if (!challenges || challenges.length === 0) {
    console.error("Sending 404 because challenges were not found.", error);
    notFound();
  }

  return <LevelOneReturnClient challenges={challenges} team={team} />;
}
