"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname() || "";

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Updates", href: "/updates" },
    { name: "DASHBOARD", href: "/dashboard" },
  ];

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav aria-label="Bottom Navigation" className="fixed justify-start bottom-6 left-1/3 -translate-x-1/2 flex items-center z-50">
      <div className="flex items-center gap-1 rounded-full bg-white/5 border border-white/40 backdrop-blur-xs p-1.5 shadow-2xl">
        <div className="flex items-center gap-1 px-2">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                  active
                    ? "font-semibold text-white shadow-2xl bg-white/10"
                    : "font-medium text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
