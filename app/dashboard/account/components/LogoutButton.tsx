"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-800/50 px-6 py-3 rounded-xl font-semibold transition-colors mt-6 w-full sm:w-auto"
    >
      Log Out of Your Account
    </button>
  );
}
