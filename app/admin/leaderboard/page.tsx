import { enforceAdminAccess } from "@/lib/guards";
import AdminLeaderboard from "@/components/admin/AdminLeaderboard";
import Link from "next/link";

export default async function AdminLeaderboardPage() {
  await enforceAdminAccess();

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-5xl font-bold mb-2 tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)]">
            LEADERBOARD
          </h1>
          <p className="mt-3 text-gray-400 text-lg font-medium tracking-wide">
            Global live standings for all teams.
          </p>
        </div>
        <div>
          <Link href="/admin" className="bg-white/5 hover:bg-white/10 text-white/80 border border-white/20 px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-400">
              <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
            </svg>
            Back to Controls
          </Link>
        </div>
      </header>
      
      <div className="w-full">
        <AdminLeaderboard />
      </div>
    </>
  );
}
