"use client";

import Image from "next/image";
import FlagSubmission from "@/components/FlagSubmission";
import HintButton from "@/components/HintButton";

export default function VictoryClient({ challenges, team }: { challenges: any[], team: any }) {
  const flag13 = challenges?.find((c) => c.flag_number === 13);

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
        <div className=" text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">You have escaped the Dream Sequence.</h2><p>?</p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
            You successfully navigated the layers of the mind, bypassed the architectures of deceit, and retrieved what was lost. The mission is complete...?
          </p>
          <div className="">
            <p className="text-sm md:text-base text-gray-400 italic">
              Go ahead, give your totem a spin... have you really escaped?
            </p>
          </div>
        </div>
      </div>

      {/* Invisible Box for Flag 13 */}
      {team?.current_flag < 14 && (
      <div className="absolute top-10 left-10 z-30 border-2 border-red-500 w-100 p-6 rounded-xl transition-all opacity-5 hover:opacity-100 hover:bg-black/60 hover:backdrop-blur-sm group flex flex-col items-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col w-full">
          <p className="text-xs text-red-400 mb-4 font-mono uppercase tracking-widest text-center">Hidden Terminal - Flag 13</p>
          {flag13?.description && (
            <p className="text-sm text-gray-300 mb-4 text-center whitespace-pre-line">{flag13.description}</p>
          )}
          <div className="w-full mb-4">
            <FlagSubmission targetFlagNumber={13} />
          </div>
          <HintButton 
            flagNumber={13} 
            unlockedHints={team?.unlocked_hints} 
          />
          {flag13?.link && (
            <div className="flex justify-center mt-6 w-full">
              <a 
                href={flag13.link} 
                download
                className="px-6 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-wider hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                </svg>
                Download Resources
              </a>
            </div>
          )}
        </div>
      </div>
      )}

    </main>
  );
}
