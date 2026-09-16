import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LevelZeroClient from "./LevelZeroClient";

export default async function RealityPage() {
  const { team } = await enforceLevelAccess("Reality");

  const supabase = await createClient();
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points, link")
    .eq("flag_number", team.current_flag)
    .maybeSingle();

  if (!challenge) {
    console.error("Sending 404 because challenge was not found. Supabase error:", error,team.current_flag);
    notFound();
  }

  return <LevelZeroClient challenge={challenge} team={team} />;
}
