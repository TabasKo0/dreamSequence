"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  username: string;
  role: string;
};

type Team = {
  id: string;
  name: string;
  join_token: string;
  owner_id: string;
  score: number;
};

export default function TeamManager() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<User[]>([]);

  // Form states
  const [createTeamName, setCreateTeamName] = useState("");
  const [joinTokenInput, setJoinTokenInput] = useState("");

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }
      
      setCurrentUserId(user.id);

      const { data: profile } = await supabase
        .from("users")
        .select("team_id")
        .eq("id", user.id)
        .single();

      if (profile?.team_id) {
        const { data: teamData } = await supabase
          .from("teams")
          .select("*")
          .eq("id", profile.team_id)
          .single();

        const { data: membersData } = await supabase
          .from("users")
          .select("id, username, role")
          .eq("team_id", profile.team_id);

        setTeam(teamData);
        setMembers(membersData || []);
      } else {
        setTeam(null);
        setMembers([]);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to load team data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleApiAction = async (url: string, payload: any) => {
    setActionLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "An error occurred");
      }
      
      setMessage(data.message || "Success");
      await fetchTeamData();
      router.refresh();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTeamName.trim()) return;
    await handleApiAction("/api/team/create", { name: createTeamName });
    setCreateTeamName("");
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinTokenInput.trim()) return;
    await handleApiAction("/api/team/join", { join_token: joinTokenInput });
    setJoinTokenInput("");
  };

  const handleLeaveTeam = async () => {
    if (!confirm("Are you sure you want to leave the team?")) return;
    await handleApiAction("/api/team/leave", {});
  };

  const handleKickMember = async (targetUserId: string) => {
    if (!confirm("Are you sure you want to kick this member?")) return;
    await handleApiAction("/api/team/kick", { targetUserId });
  };

  const handleDisbandTeam = async () => {
    if (!confirm("Are you SURE you want to disband the team? This cannot be undone.")) return;
    await handleApiAction("/api/team/disband", {});
  };

  const handleCopyToken = () => {
    if (team?.join_token) {
      navigator.clipboard.writeText(team.join_token);
      alert("Join token copied to clipboard!");
    }
  };

  if (loading) {
    return <div className="text-white/50 animate-pulse">Loading team details...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {message && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded relative">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {!team ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-white">Create a Team</h3>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={createTeamName}
                  onChange={(e) => setCreateTeamName(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-red-500 transition-colors"
                  placeholder="Enter team name"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {actionLoading ? "Creating..." : "Create Team"}
              </button>
            </form>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/20">
            <h3 className="text-xl font-bold mb-4 text-white">Join a Team</h3>
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Join Token</label>
                <input
                  type="text"
                  required
                  value={joinTokenInput}
                  onChange={(e) => setJoinTokenInput(e.target.value)}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white outline-none focus:border-red-500 transition-colors"
                  placeholder="Paste join token here"
                />
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/30 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {actionLoading ? "Joining..." : "Join Team"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-white/50 mb-1">Your Team</p>
              <h2 className="text-3xl font-bold text-white">{team.name}</h2>
              <p className="text-sm text-white/70 mt-2">
                Score: <span className="font-mono text-red-400 font-semibold">{team.score}</span>
              </p>
            </div>
            
            <div className="bg-black/40 p-4 rounded-xl border border-white/10 max-w-sm w-full md:w-auto">
              <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-semibold">Join Token</p>
              <div className="flex items-center gap-2">
                <code className="bg-black/50 text-red-300 px-3 py-1.5 rounded font-mono text-sm flex-1 overflow-x-auto whitespace-nowrap">
                  {team.join_token}
                </code>
                <button
                  onClick={handleCopyToken}
                  className="bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors text-white/70 hover:text-white"
                  title="Copy Token"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Members ({members.length}/4)</h3>
            </div>
            
            <div className="space-y-3">
              {members.map((member) => {
                const isOwner = member.id === team.owner_id;
                const isMe = member.id === currentUserId;
                const amIOwner = currentUserId === team.owner_id;

                return (
                  <div key={member.id} className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center border border-red-500/30 text-red-400 font-bold uppercase">
                        {member.username?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {member.username || "Unknown Player"}
                          {isMe && <span className="ml-2 text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">You</span>}
                        </p>
                        <p className="text-xs text-white/50">{isOwner ? "Team Captain" : "Member"}</p>
                      </div>
                    </div>

                    {amIOwner && !isMe && (
                      <button
                        onClick={() => handleKickMember(member.id)}
                        disabled={actionLoading}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                      >
                        Kick
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              {currentUserId === team.owner_id ? (
                <button
                  onClick={handleDisbandTeam}
                  disabled={actionLoading}
                  className="bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-800/50 px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
                >
                  Disband Team
                </button>
              ) : (
                <button
                  onClick={handleLeaveTeam}
                  disabled={actionLoading}
                  className="bg-white/5 hover:bg-white/10 text-white/80 border border-white/20 px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
                >
                  Leave Team
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
