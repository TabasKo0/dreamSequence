import { createClient } from "@/lib/supabase/server";

// Forces Next.js to bypass the cache and fetch fresh data on every page load
export const dynamic = "force-dynamic";

interface TeamData {
  id: number | string;
  name: string;
  score: number;
  game_level: number;
  unlocked_hints: string[];
}

export default async function AdminLeaderboard() {
  const supabase = await createClient();

  // Fetch all teams for the admin leaderboard
  const { data: teams, error } = await supabase.rpc("get_leaderboard");
  
  if (error) {
    console.error("Error fetching admin leaderboard:", error);
    return <div className="p-4 bg-red-900/20 text-red-400 rounded-lg">Failed to load leaderboard.</div>;
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-3">
        Live Leaderboard
      </h2>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-xxl whitespace-nowrap">
          <thead className="bg-black/40 text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Rank</th>
              <th className="px-6 py-4 font-semibold">Team Name</th>
              <th className="px-6 py-4 font-semibold">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-200">
            {teams?.map((team: TeamData, index: number) => (
              <tr key={team.name} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono">#{index + 1}</td>
                <td className="px-6 py-4 font-semibold text-white">{team.name}</td>
                <td className="px-6 py-4 font-mono text-white">{team.score} pts</td>
              </tr>
            ))}
            {(!teams || teams.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}