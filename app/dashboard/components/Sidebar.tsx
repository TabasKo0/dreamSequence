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
    <aside className="hidden md:flex flex-col w-64 border-r border-white/50 bg-black/20 backdrop-blur-3xl p-4 gap-6 h-full">
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
