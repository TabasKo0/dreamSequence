import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1520] bg-[url('/dashboard.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white overflow-hidden p-6">
      
      {/* Decorative Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-red-700/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full bg-red-900/20 blur-[140px] animate-float-delayed" />
      </div>

      <div className="z-10 flex flex-col items-center justify-center text-center max-w-3xl">
        

        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)]">
          DREAM SEQUENCE
        </h1>
        
        <p className="text-lg text-white/70 mb-12 max-w-xl mx-auto leading-relaxed">
          Descend through layers of the subconscious. Build your team, solve challenges, and navigate the dream.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 border border-white/50 backdrop-blur-md shadow-xl text-white font-semibold tracking-wide hover:bg-white/20 transition-all text-center">
            Go to Dashboard
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md shadow-xl text-white/70 hover:text-white font-semibold tracking-wide hover:bg-white/10 transition-all text-center">
            Login / Sign Up
          </Link>
        </div>
      </div>

    </div>
  );
}