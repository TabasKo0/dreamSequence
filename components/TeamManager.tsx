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
  unlocked_hints: number[];
};

type CtfSettings = {
  id: number;
  is_active?: boolean;
  submissions_locked?: boolean;
  team_creation_enabled?: boolean;
  team_join_enabled?: boolean;
  team_leave_enabled?: boolean;
  team_disband_enabled?: boolean;
  max_team_size?: number;
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
  const [settings, setSettings] = useState<CtfSettings | null>(null);

  // Form states
  const [createTeamName, setCreateTeamName] = useState("");
  const [joinTokenInput, setJoinTokenInput] = useState("");

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch CTF Settings (singleton row id = 1)
      try {
        const { data: settingsData, error: settingsError } = await supabase
          .from("ctf_settings")
          .select("*")
          .eq("id", 1)
          .single();

        if (settingsError) {
          console.warn("Notice: Could not load ctf_settings:", settingsError.message);
        } else if (settingsData) {
          setSettings(settingsData);
        }
      } catch (settingsErr) {
        console.warn("Exception while loading ctf_settings:", settingsErr);
      }

      // 2. Fetch User & Profile
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("team_id")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      }

      if (profile?.team_id) {
        const { data: teamData, error: teamError } = await supabase
          .from("teams")
          .select("*")
          .eq("id", profile.team_id)
          .single();

        if (teamError) {
          console.error("Error fetching team:", teamError);
        }

        const { data: membersData, error: membersError } = await supabase
          .from("users")
          .select("id, username, role")
          .eq("team_id", profile.team_id);

        if (membersError) {
          console.error("Error fetching members:", membersError);
        }

        setTeam(teamData);
        setMembers(membersData || []);
      } else {
        setTeam(null);
        setMembers([]);
      }
    } catch (err: any) {
      console.error("Failed to load team data:", err);
      setError(err?.message || "Failed to load team data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();

    // Listen for realtime updates on ctf_settings
    const channel = supabase
      .channel("realtime_ctf_settings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ctf_settings",
          filter: "id=eq.1",
        },
        (payload) => {
          if (payload.new) {
            setSettings(payload.new as CtfSettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-dismiss success notification after 5s
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Derive enabled flags from settings (default to enabled if settings are not loaded)
  const isTeamCreationEnabled =
    settings && typeof settings.team_creation_enabled === "boolean"
      ? settings.team_creation_enabled
      : true;

  const isTeamJoinEnabled =
    settings && typeof settings.team_join_enabled === "boolean"
      ? settings.team_join_enabled
      : true;

  const isTeamLeaveEnabled =
    settings && typeof settings.team_leave_enabled === "boolean"
      ? settings.team_leave_enabled
      : true;

  const isTeamDisbandEnabled =
    settings && typeof settings.team_disband_enabled === "boolean"
      ? settings.team_disband_enabled
      : true;

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

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // Handle non-JSON responses gracefully
      }

      if (!res.ok) {
        const errorMsg =
          data?.error ||
          data?.message ||
          (typeof data === "string" ? data : `Request failed with status ${res.status}`);
        throw new Error(errorMsg);
      }

      setMessage(data?.message || "Success");
      await fetchTeamData();
      router.refresh();
      return true;
    } catch (err: any) {
      console.error(`Database/API action error for ${url}:`, err);
      setError(err?.message || "An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeamCreationEnabled) {
      setError("Team creation is currently disabled by the organizers.");
      return;
    }
    if (!createTeamName.trim()) return;

    const success = await handleApiAction("/api/team/create", { name: createTeamName.trim() });
    if (success) {
      setCreateTeamName("");
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeamJoinEnabled) {
      setError("Joining teams is currently disabled.");
      return;
    }
    if (!joinTokenInput.trim()) return;

    const success = await handleApiAction("/api/team/join", { join_token: joinTokenInput.trim() });
    if (success) {
      setJoinTokenInput("");
    }
  };

  const handleLeaveTeam = async () => {
    if (!isTeamLeaveEnabled) {
      setError("Leaving or modifying team rosters is currently disabled.");
      return;
    }
    if (!confirm("Are you sure you want to leave the team?")) return;
    await handleApiAction("/api/team/leave", {});
  };

  const handleKickMember = async (targetUserId: string) => {
    if (!isTeamLeaveEnabled) {
      setError("Leaving or modifying team rosters is currently disabled.");
      return;
    }
    if (!confirm("Are you sure you want to kick this member?")) return;
    await handleApiAction("/api/team/kick", { targetUserId });
  };

  const handleDisbandTeam = async () => {
    if (!isTeamDisbandEnabled) {
      setError("Team disbanding is currently disabled by the organizers.");
      return;
    }
    if (!confirm("Are you SURE you want to disband the team? This cannot be undone.")) return;
    await handleApiAction("/api/team/disband", {});
  };

  const handleCopyToken = () => {
    if (team?.join_token) {
      navigator.clipboard.writeText(team.join_token);
      setMessage("Join token copied to clipboard!");
    }
  };

  if (loading) {
    return <div className="text-white/50 animate-pulse">Loading team details...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Toast / Alert Notification for Database Exceptions & Errors */}
      {error && (
        <div className="flex items-start justify-between gap-3 bg-red-500/15 border border-red-500/50 text-red-200 px-5 py-4 rounded-xl shadow-xl backdrop-blur-md transition-all">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-red-300 text-sm">Action Failed</p>
              <p className="text-sm text-red-200/95 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-100 transition-colors p-1 rounded-lg hover:bg-red-500/20 shrink-0"
            title="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Success Notification */}
      {message && (
        <div className="flex items-start justify-between gap-3 bg-emerald-500/15 border border-emerald-500/50 text-emerald-200 px-5 py-4 rounded-xl shadow-xl backdrop-blur-md transition-all">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-emerald-300 text-sm">Success</p>
              <p className="text-sm text-emerald-200/95 mt-0.5">{message}</p>
            </div>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-emerald-400 hover:text-emerald-100 transition-colors p-1 rounded-lg hover:bg-emerald-500/20 shrink-0"
            title="Dismiss message"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {!team ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Team Card */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Create a Team</h3>
                {!isTeamCreationEnabled && (
                  <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-medium tracking-wide">
                    Disabled
                  </span>
                )}
              </div>

              {isTeamCreationEnabled ? (
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
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Creating..." : "Create Team"}
                  </button>
                </form>
              ) : (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-200 text-sm flex items-start gap-3 my-2">
                  <svg
                    className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-300">Creation Unavailable</p>
                    <p className="text-amber-200/90 mt-1">
                      Team creation is currently disabled by the organizers.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Join Team Card */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Join a Team</h3>
                {!isTeamJoinEnabled && (
                  <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-medium tracking-wide">
                    Disabled
                  </span>
                )}
              </div>

              {isTeamJoinEnabled ? (
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
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/30 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {actionLoading ? "Joining..." : "Join Team"}
                  </button>
                </form>
              ) : (
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-200 text-sm flex items-start gap-3 my-2">
                  <svg
                    className="w-5 h-5 text-amber-400 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-amber-300">Joining Unavailable</p>
                    <p className="text-amber-200/90 mt-1">Joining teams is currently disabled.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                  className="bg-white/10 hover:bg-white/20 p-1.5 rounded transition-colors text-white/70 hover:text-white cursor-pointer"
                  title="Copy Token"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <h3 className="text-xl font-bold text-white">
                Members ({members.length}/{settings?.max_team_size ?? 4})
              </h3>
              {!isTeamLeaveEnabled && (
                <span
                  className="text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-medium tracking-wide flex items-center gap-1.5 shadow-sm"
                  title="Rosters are currently locked."
                >
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Rosters are currently locked.
                </span>
              )}
            </div>

            <div className="space-y-3">
              {members.map((member) => {
                const isOwner = member.id === team.owner_id;
                const isMe = member.id === currentUserId;
                const amIOwner = currentUserId === team.owner_id;

                return (
                  <div
                    key={member.id}
                    className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-red-900/20 flex items-center justify-center border border-red-500/30 text-red-400 font-bold uppercase">
                        {member.username?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {member.username || "Unknown Player"}
                          {isMe && (
                            <span className="ml-2 text-xs bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-white/50">{isOwner ? "Team Captain" : "Member"}</p>
                      </div>
                    </div>

                    {amIOwner && !isMe && (
                      isTeamLeaveEnabled ? (
                        <button
                          onClick={() => handleKickMember(member.id)}
                          disabled={actionLoading}
                          className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                        >
                          Kick
                        </button>
                      ) : (
                        <span
                          className="text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg cursor-not-allowed select-none flex items-center gap-1"
                          title="Rosters are currently locked."
                        >
                          <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Locked
                        </span>
                      )
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-end items-end sm:items-center gap-3">
              {currentUserId === team.owner_id ? (
                isTeamLeaveEnabled ? (
                  <button
                    onClick={handleDisbandTeam}
                    disabled={actionLoading}
                    className="bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-800/50 px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    Disband Team
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <button
                      disabled
                      className="bg-white/5 text-white/30 border border-white/10 px-5 py-2 rounded-lg font-semibold text-sm cursor-not-allowed flex items-center gap-2 select-none opacity-60"
                      title="Team disbanding is currently disabled by the organizers."
                    >
                      <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Disband Team
                    </button>
                    <span
                      className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
                      title="Team disbanding is currently disabled by the organizers."
                    >
                      Disbanding is disabled.
                    </span>
                  </div>
                )
              ) : (
                isTeamLeaveEnabled ? (
                  <button
                    onClick={handleLeaveTeam}
                    disabled={actionLoading}
                    className="bg-white/5 hover:bg-white/10 text-white/80 border border-white/20 px-5 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    Leave Team
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <button
                      disabled
                      className="bg-white/5 text-white/30 border border-white/10 px-5 py-2 rounded-lg font-semibold text-sm cursor-not-allowed flex items-center gap-2 select-none opacity-60"
                      title="Rosters are currently locked."
                    >
                      <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Leave Team
                    </button>
                    <span
                      className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5"
                      title="Rosters are currently locked."
                    >
                      Rosters are currently locked.
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
