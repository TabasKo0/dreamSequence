"use server";

import { enforceAdminAccess } from "@/lib/guards";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateCtfSettingsAction(updates: Record<string, any>) {
  try {
    // 1. Enforce admin access securely
    await enforceAdminAccess();

    const supabase = await createClient();

    // 2. Update the setting
    const { error } = await supabase
      .from("ctf_settings")
      .update(updates)
      .eq("id", 1);

    if (error) {
      console.error(`Failed to update settings:`, error);
      return { success: false, message: "Failed to update settings. Please try again." };
    }

    // 3. Purge Next.js cache so the UI updates instantly everywhere
    revalidatePath("/", "layout");

    return { success: true, message: "Settings updated successfully." };
  } catch (err: any) {
    console.error("Error updating CTF settings:", err);
    return { success: false, message: err?.message || "An unexpected error occurred." };
  }
}
