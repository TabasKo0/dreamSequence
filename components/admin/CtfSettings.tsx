"use client";

import { useTransition, useState, useEffect } from "react";
import { updateCtfSettingsAction } from "@/app/actions/adminActions";

interface CtfSettingsProps {
  initialSettings: {
    is_active: boolean;
    submissions_locked: boolean;
    team_creation_enabled: boolean;
    team_join_enabled: boolean;
    max_team_size: number;
    team_leave_enabled: boolean;
    team_disband_enabled: boolean;
  };
}

export default function CtfSettings({ initialSettings }: CtfSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState(initialSettings);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Grouped logic derived state
  const registrationOpen = settings.team_creation_enabled && settings.team_join_enabled;
  const teamManagementOpen = settings.team_leave_enabled && settings.team_disband_enabled;

  const handleToggle = (settingGroup: "is_active" | "submissions_locked" | "registration" | "team_management") => {
    let updates: Record<string, boolean> = {};

    if (settingGroup === "is_active") {
      updates = { is_active: !settings.is_active };
    } else if (settingGroup === "submissions_locked") {
      updates = { submissions_locked: !settings.submissions_locked };
    } else if (settingGroup === "registration") {
      const newValue = !registrationOpen;
      updates = { team_creation_enabled: newValue, team_join_enabled: newValue };
    } else if (settingGroup === "team_management") {
      const newValue = !teamManagementOpen;
      updates = { team_leave_enabled: newValue, team_disband_enabled: newValue };
    }

    // Optimistic UI update
    setSettings((prev) => ({ ...prev, ...updates }));
    
    startTransition(async () => {
      const result = await updateCtfSettingsAction(updates);
      
      if (result.success) {
        setMessage({ text: result.message, type: "success" });
      } else {
        // Revert UI on failure (flip back)
        const reverts: Record<string, boolean> = {};
        for (const [k, v] of Object.entries(updates)) {
            reverts[k] = !v;
        }
        setSettings((prev) => ({ ...prev, ...reverts }));
        setMessage({ text: result.message, type: "error" });
      }
      
      // Auto-hide message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const handleMaxTeamSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      setSettings((prev) => ({ ...prev, max_team_size: val }));
    }
  };

  const handleMaxTeamSizeSubmit = () => {
    const updates = { max_team_size: settings.max_team_size };
    startTransition(async () => {
      const result = await updateCtfSettingsAction(updates);
      if (result.success) {
        setMessage({ text: "Max team size updated.", type: "success" });
      } else {
        setMessage({ text: result.message, type: "error" });
      }
      setTimeout(() => setMessage(null), 3000);
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-blue-400">
          <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.097.078.15.222.15.399v.227c0 .177-.053.321-.15.399l-.84.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.098-.078-.15-.222-.15-.399v-.227c0-.177.052-.321.15-.399l.84-.692a1.875 1.875 0 0 0 .432-2.385l-.923-1.597a1.875 1.875 0 0 0-2.28-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
        </svg>
        CTF Master Controls
      </h2>

      {message && (
        <div className={`mb-6 p-4 rounded-xl border ${message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"} flex items-center gap-3 animate-in fade-in`}>
          {message.type === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16ZM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-medium tracking-wide">{message.text}</span>
        </div>
      )}

      <div className="space-y-6">
        
        {/* Toggle 1: Event Active */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-black/20 rounded-xl border border-white/5">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-white">Event Active</h3>
            <p className="text-sm text-gray-400 mt-1">
              Global kill switch for the entire CTF event.
            </p>
          </div>
          <button
            onClick={() => handleToggle("is_active")}
            disabled={isPending}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:opacity-50 ${
              settings.is_active ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-white/10"
            }`}
          >
            <span className="sr-only">Toggle Event Active</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.is_active ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Submissions Locked */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-black/20 rounded-xl border border-white/5">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-white">Submissions Locked</h3>
            <p className="text-sm text-gray-400 mt-1">
              Prevent players from submitting flags.
            </p>
          </div>
          <button
            onClick={() => handleToggle("submissions_locked")}
            disabled={isPending}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:opacity-50 ${
              settings.submissions_locked ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" : "bg-white/10"
            }`}
          >
            <span className="sr-only">Toggle Submissions Locked</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                settings.submissions_locked ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Registration Phase */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-black/20 rounded-xl border border-white/5">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-white">Registration Phase</h3>
            <p className="text-sm text-gray-400 mt-1">
              Controls global access to both "Create Team" and "Join Team".
            </p>
          </div>
          <button
            onClick={() => handleToggle("registration")}
            disabled={isPending}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:opacity-50 ${
              registrationOpen ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "bg-white/10"
            }`}
          >
            <span className="sr-only">Toggle Registration</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                registrationOpen ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Number Input: Max Team Size */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-black/20 rounded-xl border border-white/5">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-white">Max Team Size</h3>
            <p className="text-sm text-gray-400 mt-1">
              Maximum allowed members per team.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="number"
              min="1"
              value={settings.max_team_size || ""}
              onChange={handleMaxTeamSizeChange}
              disabled={isPending}
              className="bg-black/40 border border-white/10 text-white rounded-lg px-3 py-1.5 w-20 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              onClick={handleMaxTeamSizeSubmit}
              disabled={isPending || settings.max_team_size === initialSettings.max_team_size}
              className="bg-blue-600/80 hover:bg-blue-500 text-white text-sm px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </div>

        {/* Toggle 4: Team Management */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-black/20 rounded-xl border border-white/5">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold text-white">Team Management</h3>
            <p className="text-sm text-gray-400 mt-1">
              Controls global access to both "Leave Team" and "Disband Team".
            </p>
          </div>
          <button
            onClick={() => handleToggle("team_management")}
            disabled={isPending}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:opacity-50 ${
              teamManagementOpen ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-white/10"
            }`}
          >
            <span className="sr-only">Toggle Team Management</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                teamManagementOpen ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
