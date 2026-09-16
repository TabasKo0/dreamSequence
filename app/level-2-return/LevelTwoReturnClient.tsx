"use client";

import { useState } from "react";
import Image from "next/image";
import FlagSubmission from "@/components/FlagSubmission";
import IntroSequence from "@/components/IntroSequence";
import HintButton from "@/components/HintButton";
import lore from "../../.lore.json";

export default function LevelTwoReturnClient({ challenge, team }: { challenge: any, team?: any }) {
  // Intro sequence logic
  const [introFinished, setIntroFinished] = useState(challenge?.flag_number !== 11);
  
  // Tab logic for toggling signboards
  // Default to 11 for the return level
  const activeTab = 11;

  // Fetch lore
  const activeLore = lore.challenges.find((c) => c.sequence === activeTab) || lore.challenges.find((c) => c.stage === "level-2-return");
  const title = activeLore?.title || challenge?.title || "LEVEL 2 RETURN";
  const description = activeLore?.description || challenge?.description || "Back through Level 2.";
  
  const currentIntroText = lore.stages.find(s => s.id === "level-2-return")?.intro_text || "";

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/level_2.png"
        alt="Level 2 Background"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-80"
        priority
      />
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      {/* Intro Sequence Overlay */}
      {!introFinished && (
        <IntroSequence 
          asOverlay={true} 
          text={currentIntroText}
          onComplete={() => setIntroFinished(true)} 
        />
      )}

      {introFinished && (
        <div className="absolute inset-0 w-full h-full animate-in fade-in duration-1000">
          
          {/* LEFT SIGNBOARD (Empty Artifact Place) */}
          <div
            className={`absolute top-[46%] left-[24%] -translate-y-1/2 -translate-x-1/2 w-[18vw] h-[55vh] md:w-[18vw] md:h-[55vh] z-20 transition-all duration-300 flex flex-col items-center justify-center cursor-not-allowed opacity-30`}
          >
            <div className="relative z-10 flex flex-col items-center pt-2 pointer-events-none">
              <span className={`text-sm md:text-base font-black tracking-widest drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-gray-500`}>
                EMPTY
              </span>
            </div>
          </div>

          {/* CENTER DIALOGUE BOX */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-30">
            <div className="relative w-full rounded-[2rem] bg-gradient-to-r from-white-800/40 to-white-900/40 border border-white/50 backdrop-blur-xs p-8 shadow-2xl overflow-hidden transition-all duration-500">
              <div className="absolute inset-0 bg-white/5"></div>
              <div className="absolute top-0 left-1/4 w-1/3 h-full bg-white-500/10 blur-[6px] -z-10"></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <h1 className="text-base mb-4 text-3xl md:text-4xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,0.7)] text-center">
                  {title}
                </h1>
                <p className="text-base md:text-lg leading-relaxed text-white whitespace-pre-line text-center mb-6">
                  {description}
                </p>

                <HintButton 
                  flagNumber={challenge?.flag_number} 
                  unlockedHints={team?.unlocked_hints} 
                  key={challenge?.flag_number}
                />
                
                {challenge?.link && (
                  <div className="flex justify-center mb-8 w-full">
                    <a 
                      href={challenge.link} 
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

                <div className="w-full">
                  <FlagSubmission targetFlagNumber={activeTab} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIGNBOARD (Flag 10 - Over the Door) */}
          <button
            className={`absolute top-[55%] right-[10%] md:right-[12.5%] translate-x-1/2 -translate-y-1/2 w-[20vw] h-[110vh] md:w-[22vw] md:h-[110vh] z-20 transition-all duration-300 flex flex-col items-center justify-center bg-red-400/10 shadow-[0_0_25px_rgba(220,38,38,0.1)] cursor-default`}
            style={{ clipPath: 'polygon(0% 20%, 115% 0%, 100% 100%, 0% 100%)' }}
          >
            <div className="relative z-10 flex flex-col items-center pt-2 pointer-events-none">
              <span className={`text-sm md:text-base font-black tracking-widest drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-red-300`}>
                THE WAY UP
              </span>
              <span className={`text-xs mt-1 font-bold drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-red-200/80`}>Flag 11</span>
            </div>
          </button>

        </div>
      )}
    </main>
  );
}
