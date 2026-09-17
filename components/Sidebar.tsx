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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-4 w-full p-4 bg-black/40 backdrop-blur-xl border-b border-white/20 z-50 shrink-0">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-1">
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
        <h1 className="text-xl font-bold tracking-wider text-red-500 font-montserrat drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
          DREAM SEQUENCE
        </h1>
      </div>

      {/* Sidebar (Desktop + Mobile Slide-out) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex flex-col w-64 border-r border-white/50 bg-[#0d1520]/95 md:bg-black/20 backdrop-blur-3xl p-4 pt-20 md:pt-4 gap-6 h-full shrink-0 overflow-y-auto shadow-2xl md:shadow-none
      `}>
      {/* User Card */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/50 shadow-lg mt-2">
        <div className="w-10 h-10 shrink-0 rounded-full bg-slate-500 flex items-center justify-center text-lg font-medium text-white shadow-inner">
          {initial}
        </div>
        <div className="flex flex-col overflow-hidden w-full">
          <span className="text-sm font-semibold truncate" title={username}>{username}</span>
          <span className="text-xs text-white/60 truncate" title={email}>{email}</span>
          <div className="flex items-center gap-1 mt-1">
          
          </div>
        </div>
      </div>

      {/* Dynamic Event Status in Sidebar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs mt-3">
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

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
