"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type CtfSettings = {
  id: number;
  is_active: boolean;
  submissions_locked: boolean;
  team_creation_enabled: boolean;
  team_join_enabled: boolean;
  team_leave_enabled?: boolean;
  team_disband_enabled?: boolean;
  max_team_size: number;
  updated_at?: string;
};

interface EventStatusProps {
  initialSettings?: CtfSettings | null;
}

export default function EventStatus({ initialSettings }: EventStatusProps) {
  const supabase = createClient();
  const [settings, setSettings] = useState<CtfSettings | null>(initialSettings ?? null);

  useEffect(() => {
    // 1. If not provided initially via SSR, fetch on mount
    if (!initialSettings) {
      supabase
        .from("ctf_settings")
        .select("*")
        .eq("id", 1)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setSettings(data as CtfSettings);
          }
        });
    }

    // 2. Realtime listener for dynamic state changes
    const channel = supabase
      .channel("realtime_event_status_banner")
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
  }, [initialSettings, supabase]);

  // Compute dynamic status based on ctf_settings (is_active and submissions_locked)
  const isActive = settings ? Boolean(settings.is_active) : false;
  const submissionsLocked = settings ? Boolean(settings.submissions_locked) : true;

  let statusTitle = "STATUS: STANDBY";
  let statusSubtitle = "The event is currently in standby mode.";
  let badgeLabel = "Inactive";
  let badgeClasses = "bg-zinc-500/10 text-zinc-300 border-zinc-500/30";
  let dotPingColor = "bg-zinc-400";
  let dotColor = "bg-zinc-400";
  let showPing = false;

  if (isActive && !submissionsLocked) {
    statusTitle = "STATUS: STARTED";
    statusSubtitle = "Event is live! Flag submissions and challenges are open.";
    badgeLabel = "Live";
    badgeClasses = "bg-cyan-400/10 text-cyan-400 border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]";
    dotPingColor = "bg-cyan-400";
    dotColor = "bg-cyan-400";
    showPing = true;
  } else if (isActive && submissionsLocked) {
    statusTitle = "STATUS: PAUSED";
    statusSubtitle = "The CTF is running, but flag submissions are temporarily frozen.";
    badgeLabel = "Paused";
    badgeClasses = "bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
    dotPingColor = "bg-amber-400";
    dotColor = "bg-amber-400";
    showPing = true;
  } else {
    statusTitle = "STATUS: NOT STARTED";
    statusSubtitle = "The organizers have not started the event yet. Get ready!";
    badgeLabel = "Offline";
    badgeClasses = "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
    dotPingColor = "bg-zinc-400";
    dotColor = "bg-zinc-400";
    showPing = false;
  }

  return (
    <>
      <div className="z-10">
        <h2 className="text-3xl font-light tracking-wide mb-1 flex items-center gap-2">
          {statusTitle}
        </h2>
        <p className="text-sm text-white/50">{statusSubtitle}</p>
      </div>

      <div
        className={`absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all ${badgeClasses}`}
      >
        <span className="relative flex h-2.5 w-2.5">
          {showPing && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotPingColor} opacity-75`}
            ></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColor}`}></span>
        </span>
        <span className="text-xs font-semibold tracking-wider uppercase">{badgeLabel}</span>
      </div>
    </>
  );
}
