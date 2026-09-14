import { enforceLevelAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LimboClient from "./LimboClient";

export default async function LimboPage() {
  const { team } = await enforceLevelAccess("Limbo");

  const supabase = await createClient();
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("flag_number, game_level, title, category, description, points")
    //.eq("game_level", 'Limbo')
    .eq("flag_number", team.current_flag)
    .maybeSingle();

  if (!challenge) {
    console.error("Sending 404 because challenge was not found. Supabase error:", error);
    notFound();
  }

  return <LimboClient challenge={challenge} />;
}
