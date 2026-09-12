"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState<string>("Loading...");
  const [username, setUsername] = useState<string>("Loading...");
  const [initial, setInitial] = useState<string>("?");
  const [eventSettings, setEventSettings] = useState<{
    is_active: boolean;
    submissions_locked: boolean;
  } | null>(null);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "Unknown Email");
        
        const { data: profile } = await supabase
          .from("users")
          .select("username")
          .eq("id", user.id)
          .single();

        if (profile?.username) {
          setUsername(profile.username);
          setInitial(profile.username.charAt(0).toUpperCase());
        } else {
          setUsername("Participant");
          setInitial(user.email ? user.email.charAt(0).toUpperCase() : "?");
        }
      } else {
        setEmail("Not logged in");
        setUsername("Guest");
      }
    }

    getUserData();

    // Fetch initial event settings
    supabase
      .from("ctf_settings")
      .select("is_active, submissions_locked")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setEventSettings(data);
      });

    // Realtime listener for dynamic event status in sidebar
    const channel = supabase
      .channel("sidebar_realtime_event_status")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ctf_settings", filter: "id=eq.1" },
        (payload) => {
          if (payload.new) {
            setEventSettings(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Team", href: "/dashboard/team" },
    { name: "Account", href: "/dashboard/account" },
    { name: "Hall ID", href: "/dashboard/hall-id" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/50 bg-black/20 backdrop-blur-3xl p-4 gap-6 h-full shrink-0 overflow-y-auto">
      {/* User Card */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/50 shadow-lg mt-2">
        <div className="w-10 h-10 shrink-0 rounded-full bg-slate-500 flex items-center justify-center text-lg font-medium text-white shadow-inner">
          {initial}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <span className="text-sm font-semibold truncate" title={username}>{username}</span>
          <span className="text-xs text-white/60 truncate" title={email}>{email}</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-full max-w-[40px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-[10px] text-cyan-400 font-medium tracking-wide flex items-center justify-center border border-cyan-400/30">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Event Status in Sidebar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
        <span className="text-white/60 font-medium">Event</span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {eventSettings?.is_active && !eventSettings?.submissions_locked ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </>
            ) : eventSettings?.is_active && eventSettings?.submissions_locked ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-400"></span>
            )}
          </span>
          <span
            className={`font-semibold tracking-wide ${
              eventSettings?.is_active && !eventSettings?.submissions_locked
                ? "text-cyan-400"
                : eventSettings?.is_active && eventSettings?.submissions_locked
                ? "text-amber-400"
                : "text-zinc-400"
            }`}
          >
            {eventSettings?.is_active && !eventSettings?.submissions_locked
              ? "Live"
              : eventSettings?.is_active && eventSettings?.submissions_locked
              ? "Paused"
              : "Offline"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-4 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white/10 text-white font-medium shadow-sm border border-white/50"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto mb-4">
        <button 
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left font-medium border border-transparent hover:border-red-500/30"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
