import TeamManager from "@/components/TeamManager";

export default function TeamPage() {
  return (
    <main className="flex-1 min-h-0 flex flex-col h-full p-6 md:p-10 relative overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)]">TEAM</h1>
      </header>
      <div className="rounded-[2rem] bg-white/5 border border-white/50 backdrop-blur-xs p-8 shadow-xl relative mb-6">
        <TeamManager />
      </div>
      {/* Bottom padding for fixed dock */}
      <div className="h-10 shrink-0"></div>
    </main>
  );
}
