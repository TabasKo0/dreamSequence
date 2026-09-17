"use server";

import { createClient } from "@/lib/supabase/server";

export async function verifyEmailAction(email: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("check_authorization", { p_email: email });

    if (error) {
      console.error("RPC Error:", error);
      return { success: false, message: "An error occurred while verifying the email." };
    }

    if (data === true) {
      return { success: true, message: "Email authorized." };
    } else {
      return { success: false, message: "This email is not authorized to register for the CTF." };
    }
  } catch (err) {
    console.error("Verification exception:", err);
    return { success: false, message: "A network error occurred." };
  }
}
