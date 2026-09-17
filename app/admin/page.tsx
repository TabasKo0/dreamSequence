import { enforceAdminAccess } from "@/lib/guards";
import CtfSettings from "@/components/admin/CtfSettings";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminPage() {
  await enforceAdminAccess();

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("ctf_settings")
    .select("is_active, submissions_locked, team_creation_enabled, team_join_enabled, max_team_size, team_leave_enabled, team_disband_enabled")
    .eq("id", 1)
    .single();

  const initialSettings = settings || {
    is_active: false,
    submissions_locked: false,
    team_creation_enabled: false,
    team_join_enabled: false,
    max_team_size: 4,
    team_leave_enabled: false,
    team_disband_enabled: false,
  };

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-5xl font-bold mb-2 tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)]">
            ADMIN DASHBOARD
          </h1>
          <p className="mt-3 text-gray-400 text-lg font-medium tracking-wide">
            System controls and master settings.
          </p>
        </div>
        <div>
          <Link href="/admin/leaderboard" className="bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-800/50 px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-400">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            View Live Leaderboard
          </Link>
        </div>
      </header>
      
      <div className="max-w-3xl">
        <CtfSettings initialSettings={initialSettings} />
      </div>
    </>
  );
}
