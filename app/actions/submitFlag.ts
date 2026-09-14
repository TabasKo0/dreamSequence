"use server";

import { createClient } from "@/lib/supabase/server";

export async function verifyFlagAction(prevState: any, formData: FormData) {
  const flag = formData.get("flag") as string;
  const targetFlagNumberStr = formData.get("targetFlagNumber") as string;
  
  if (!flag || !targetFlagNumberStr) {
    return { success: false, message: "Missing required fields." };
  }

  const targetFlagNumber = parseInt(targetFlagNumberStr, 10);
  
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_flag", {
    p_target_flag: targetFlagNumber,
    p_submitted_flag: flag
  });

  if (error) {
    console.error("RPC Error:", error);
    return { success: false, message: "Server error occurred." };
  }

  if (data && data.success === false) {
    return { success: false, message: data.message };
  }

  if (data && data.success === true) {
    // Fetch the updated game_level to redirect to the correct next flag
    const { data: { user } } = await supabase.auth.getUser();
    let nextUrl = "/dashboard";
    if (user) {
      const { data: profile } = await supabase.from("users").select("team_id").eq("id", user.id).single();
      if (profile) {
        const { data: team } = await supabase.from("teams").select("game_level").eq("id", profile.team_id).single();
        if (team && team.game_level) {
          const slug = team.game_level.toLowerCase().replace(/ /g, '-');
          nextUrl = `/${slug}`;
        }
      }
    }
    
    return { success: true, message: data.message, nextUrl };
  }

  return { success: false, message: "Unexpected response from server." };
}
