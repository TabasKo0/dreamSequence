"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import FlagSubmission from "@/components/FlagSubmission";
import IntroSequence from "@/components/IntroSequence";
import lore from "../../.lore.json";

export default function LevelThreeClient({ challenge }: { challenge: any }) {
  // Intro sequence logic
  const [introFinished, setIntroFinished] = useState(challenge?.flag_number !== 7);
  
  // Tab logic for toggling doors
  let defaultTab = 7;
  if (challenge?.flag_number === 8) defaultTab = 8;
  if (challenge?.flag_number === 10) defaultTab = 10;
  const [activeTab, setActiveTab] = useState<number>(defaultTab);

  useEffect(() => {
    if (challenge?.flag_number === 8 || challenge?.flag_number === 10 || challenge?.flag_number === 7) {
      setActiveTab(challenge.flag_number);
    }
  }, [challenge?.flag_number]);

  const currentIntroText = lore.stages.find(s => s.id === "level-3")?.intro_text || "";
  
  // Status logic
  const isFlag7Solved = challenge?.flag_number > 7 && challenge?.flag_number !== 7;
  const isFlag8Solved = challenge?.flag_number > 8 && challenge?.flag_number !== 8;
  const isFlag10Solved = challenge?.flag_number > 10 && challenge?.flag_number !== 10;

  // Render a specific door interactable or its expanded dialogue box
  const renderDoor = (
    flagNumber: number, 
    positionClasses: string, 
    titleText: string, 
    subText: string, 
    isSolved: boolean
  ) => {
    const isActive = activeTab === flagNumber;
    
    if (isActive) {
      const activeLore = lore.challenges.find((c) => c.sequence === flagNumber) || lore.challenges.find((c) => c.stage === "level-3");
      const title = activeLore?.title || challenge?.title || `FLAG ${flagNumber}`;
      const description = activeLore?.description || challenge?.description || "...";

      return (
        <div className={`absolute z-30 transition-all duration-500 w-[30vw] min-w-[320px] max-w-[90vw] ${positionClasses} -translate-x-1/2 -translate-y-1/2`}>
          <div className="relative w-full rounded-[2rem] bg-gradient-to-r from-white-800/40 to-white-900/40 border border-white/50 backdrop-blur-xs p-6 md:p-8 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="absolute inset-0 bg-white/5"></div>
            <div className="absolute top-0 left-1/4 w-1/3 h-full bg-white-500/10 blur-[6px] -z-10"></div>
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <h1 className="text-base mb-4 text-2xl md:text-3xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,0.7)] text-center">
                {title}
              </h1>
              <p className="text-sm md:text-base leading-relaxed text-white whitespace-pre-line text-center mb-6 drop-shadow-md">
                {description}
              </p>
              
              {/* Resources Link Placeholder */}
              <div className="flex justify-center mb-8 w-full">
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-wider hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                  </svg>
                  VIEW RESOURCES
                </a>
              </div>

              <div className="w-full">
                <FlagSubmission targetFlagNumber={flagNumber} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={() => setActiveTab(flagNumber)}
        disabled={isSolved}
        className={`absolute ${positionClasses} -translate-y-1/2 -translate-x-1/2 w-[18vw] h-[80vh] md:w-[18vw] md:h-[80vh] bg-red-400/7 z-20 transition-all duration-300 flex flex-col items-center justify-center hover:bg-white/10 hover:border-red-400
          ${isSolved ? "cursor-not-allowed opacity-50 grayscale" : "cursor-pointer"}`}
      >
        <div className="relative z-10 flex flex-col items-center pt-2 pointer-events-none">
          <span className={`text-sm md:text-base font-black tracking-widest drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-gray-200`}>
            {isSolved ? "LOCKED" : titleText}
          </span>
          <span className={`text-xs mt-1 font-bold drop-shadow-[0_0_10px_rgba(0,0,0,1)] text-gray-400`}>{subText}</span>
        </div>
      </button>
    );
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/level_3.png"
        alt="Level 3 Background"
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
          
          {/* LEFT DOOR (Flag 10 - Ascension) */}
          {renderDoor(
            10,
            "top-[58%] left-[19%] md:left-[19%]",
            "LEVEL 3 (RETURN)",
            "Flag 10",
            isFlag10Solved
          )}

          {/* MIDDLE DOOR (Flag 7 - Artifact) */}
          {renderDoor(
            7,
            "top-[58%] left-[50.5%]",
            "ARTIFACT",
            "Flag 7",
            isFlag7Solved
          )}

          {/* RIGHT DOOR (Flag 8 - Progression) */}
          {renderDoor(
            8,
            "top-[58%] left-[80%] md:left-[80%]",
            "THE DOOR",
            "Flag 8",
            isFlag8Solved
          )}

        </div>
      )}
    </main>
  );
}
