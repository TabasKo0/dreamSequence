export default function HallIdPage() {
  return (
    <main className="flex-1 flex flex-col h-full p-6 md:p-10 relative">
      <header className="mb-8">
        <h1 className="text-5xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)]">HALL ID</h1>
      </header>
      <div className="flex-1 rounded-[2rem] bg-white/5 border border-white/50 backdrop-blur-xs p-8 shadow-xl relative overflow-hidden">
        <p className="text-white/70">Your Hall ID details will appear here.</p>
      </div>
    </main>
  );
}
