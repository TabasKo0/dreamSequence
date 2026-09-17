import Link from "next/link";
import AeroShards from "@/components/aeroShard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#0d1520] bg-[url('/dashboard.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white overscroll-none overflow-hidden p-6">
      
      {/* Decorative Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[20%] left-[15%] w-72 h-72 rounded-full bg-red-700/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 rounded-full bg-red-900/20 blur-[140px] animate-float-delayed" />
      </div>

      {/* Decorative AeroShards Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0  opacity-70">
        <AeroShards
          backgroundColor="#000000"
          shardColor="#ff1a1a"
          accentColor="#ff4d4d"
          placement="full"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1}
          spread={1}
          depth={1}
          speed={1}
          spin={1}
          interaction="repel"
          density={1.5}
          shardSize={1.1}
          stretch={1}
          turbulence={1}
          glow={1}
          edgeSoftness={2}
          bloom={0.5}
          grain={0.05}
          chromaticAberration={0.0075}
          transitionDuration={1}
          interactionRadius={1.5}
          interactionStrength={0.5}
          rippleIntensity={1}
          holdToGather
          paused={false}
        />
      </div>

      <div className="z-10 flex flex-col items-center justify-center text-center max-w-3xl">
        

        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)]">
          DREAM SEQUENCE
        </h1>
        
        <p className="text-base sm:text-lg text-white/70 mb-12 max-w-xl mx-auto leading-relaxed">
          Descend through layers of the subconscious. Build your team, solve challenges, and navigate the dream.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {user ? (
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 border border-white/50 backdrop-blur-md shadow-xl text-white font-semibold tracking-wide hover:bg-white/20 transition-all text-center">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 border border-white/50 backdrop-blur-md shadow-xl text-white font-semibold tracking-wide hover:bg-white/20 transition-all text-center">
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}