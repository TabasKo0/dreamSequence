"use client";

import Image from "next/image";
import FlagSubmission from "@/components/FlagSubmission";
import HintButton from "@/components/HintButton";

export default function VictoryClient({ challenges, team }: { challenges: any[], team: any }) {
  
  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/victory.png"
        alt="Victory Background"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-80"
        priority
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 w-[90%] max-w-2xl flex flex-col items-center animate-in fade-in zoom-in duration-1000 mt-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight montserrat-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] text-center mb-6">
          CONGRATULATIONS
        </h1>
        <div className="bg-black/40 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">You have escaped the Dream Sequence.</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
            You successfully navigated the layers of the mind, bypassed the architectures of deceit, and retrieved what was lost. The mission is complete.
          </p>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <p className="text-sm md:text-base text-gray-400 italic">
              "But wait... Look closer at the edges. Not everything is as it seems. Is this really the end?"
            </p>
          </div>
        </div>
      </div>

      {/* Invisible Box for Flag 13 */}
      <div className="absolute bottom-10 right-10 z-30 border-2 border-red-500 w-72 p-6 rounded-xl transition-all opacity-5 hover:opacity-100 hover:bg-black/60 hover:backdrop-blur-sm group flex flex-col items-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col w-full">
          <p className="text-xs text-red-400 mb-4 font-mono uppercase tracking-widest text-center">Hidden Terminal - Flag 13</p>
          <FlagSubmission targetFlagNumber={13} />
          <HintButton 
            flagNumber={13} 
            unlockedHints={team?.unlocked_hints} 
          />
        </div>
      </div>

    </main>
  );
}
