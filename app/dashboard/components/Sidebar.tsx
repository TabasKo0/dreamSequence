"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

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
        <div className="w-10 h-10 rounded-full bg-slate-500 flex items-center justify-center text-lg font-medium text-white shadow-inner">
          S
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold truncate">Participant</span>
          <span className="text-xs text-white/60 truncate">subhayan.niyogi2025@vitstu...</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-full max-w-[40px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-[10px] text-cyan-400 font-medium tracking-wide flex items-center justify-center border border-cyan-400/30">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mt-4">
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
    </aside>
  );
}
