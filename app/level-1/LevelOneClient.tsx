"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FlagSubmission from "@/components/FlagSubmission";
import IntroSequence from "@/components/IntroSequence";
import lore from "../../.lore.json";

export default function LevelOneClient({ challenge }: { challenge: any }) {
  // Intro sequence logic
  const [introFinished, setIntroFinished] = useState(challenge?.flag_number !== 3);
  
  // Tab logic for toggling signboards
  // Default to the server's current flag, or 3 if undefined
  const defaultTab = challenge?.flag_number === 4 ? 4 : 3;
  const [activeTab, setActiveTab] = useState<number>(defaultTab);

  useEffect(() => {
    if (challenge?.flag_number === 4) {
      setActiveTab(4);
    }
  }, [challenge?.flag_number]);

  // Fetch lore based on the ACTIVE tab (so the center box updates when clicking signboards)
  const activeLore = lore.challenges.find((c) => c.sequence === activeTab) || lore.challenges.find((c) => c.stage === "level-1");
  const title = activeLore?.title || challenge?.title || "LEVEL 1";
  const description = activeLore?.description || challenge?.description || "Welcome to Level 1.";
  
  const currentIntroText = lore.stages.find(s => s.id === "level-1")?.intro_text || "";
  
  // Status logic
  const isFlag3Solved = challenge?.flag_number === 4;

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/level_1.png"
        alt="Level 1 Background"
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
          
          {/* LEFT SIGNBOARD (Flag 3) */}
          <button
            onClick={() => setActiveTab(3)}
            disabled={isFlag3Solved}
            className={`absolute top-[52%] left-[12%] md:top-[57%] md:left-[16%] -translate-y-1/2 -translate-x-1/2 w-40 h-32 md:w-100 md:h-80 flex flex-col items-center justify-center transition-all duration-300 z-20 bg-[url('/signboard.png')] bg-contain bg-center bg-no-repeat
              ${activeTab === 3 ? "scale-110 drop-shadow-[0_0_25px_rgba(220,38,38,0.2)]" : "hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105"} 
              ${isFlag3Solved ? "cursor-not-allowed grayscale" : "cursor-pointer"}`}
          >
            <div className="relative z-10 flex flex-col items-center pt-2">
              <span className={`text-sm md:text-base font-black tracking-widest drop-shadow-md ${activeTab === 3 ? "text-red-300" : "text-gray-300"}`}>
                {isFlag3Solved ? "LOCKED" : "ARTIFACT"}
              </span>
              <span className={`text-xs mt-1 font-bold ${activeTab === 3 ? "text-red-200/80" : "text-gray-400"}`}>Flag 3</span>
            </div>
          </button>

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

          {/* RIGHT SIGNBOARD (Flag 4) */}
          <button
            onClick={() => setActiveTab(4)}
            className={`absolute top-[52%] right-[12%] md:top-[57%] md:right-[16%] translate-x-1/2 -translate-y-1/2 w-40 h-32 md:w-100 md:h-80 flex flex-col items-center justify-center transition-all duration-300 z-20 bg-[url('/signboard.png')] bg-contain bg-center bg-no-repeat
              ${activeTab === 4 ? "scale-110 drop-shadow-[0_0_25px_rgba(220,38,38,0.2)]" : "hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105"}
              cursor-pointer`}
          >
            <div className="relative z-10 flex flex-col items-center pt-2">
              <span className={`text-sm md:text-base font-black tracking-widest drop-shadow-md ${activeTab === 4 ? "text-red-300" : "text-gray-300"}`}>
                THE DOOR
              </span>
              <span className={`text-xs mt-1 font-bold ${activeTab === 4 ? "text-red-200/80" : "text-gray-400"}`}>Flag 4</span>
            </div>
          </button>

        </div>
      )}
    </main>
  );
}
