import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import VictoryClient from "./VictoryClient";

export default async function VictoryPage() {
  const { team } = await enforceLevelAccess("Victory");

  const supabase = await createClient();
  // Fetch all authorized challenges for Victory level
  const { data: challenges, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points, link")
    .order("flag_number", { ascending: true });

  if (!challenges || challenges.length === 0) {
    console.warn("No challenges found for Victory. The invisible box might not work perfectly until it is added.", error);
  }

  return <VictoryClient challenges={challenges || []} team={team} />;
}
