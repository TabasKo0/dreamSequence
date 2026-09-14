"use client";

import { useState } from "react";
import FlagSubmission from "@/components/FlagSubmission";
import IntroSequence from "@/components/IntroSequence";
import lore from "../../.lore.json";

export default function LevelThreeClient({ challenge }: { challenge: any }) {
  const [introFinished, setIntroFinished] = useState(challenge?.flag_number !== 7);

  const loreChallenge = lore.challenges.find((c) => c.sequence === challenge?.flag_number) || lore.challenges.find((c) => c.stage === "level-3");
  const title = loreChallenge?.title || challenge?.title || "LEVEL 3";
  const description = loreChallenge?.description || challenge?.description || "Welcome to Level 3.";
  const warningText = (loreChallenge as any)?.warning;
  
  const currentIntroText = lore.stages.find(s => s.id === "level-3")?.intro_text || "";
  
  const isDoorPhase = challenge?.flag_number === 8;

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-8 overflow-hidden">
      {!introFinished && (
        <IntroSequence 
          asOverlay={true} 
          text={currentIntroText}
          onComplete={() => setIntroFinished(true)} 
        />
      )}

      {introFinished && (
        <div className={`relative max-w-2xl w-full z-10 animate-in fade-in duration-1000 flex items-center gap-12 transition-all duration-1000 ${isDoorPhase ? "translate-x-[-5%]" : ""}`}>
          
          <div className="relative w-full rounded-[2rem] bg-gradient-to-r from-white-800/40 to-white-900/40 border border-white/50 backdrop-blur-xs p-8 shadow-2xl overflow-hidden transition-all duration-500 flex-1">
            <div className="absolute inset-0 bg-white/5"></div>
            <div className="absolute top-0 left-1/4 w-1/3 h-full bg-white-500/10 blur-[6px] -z-10"></div>
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <h1 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)] text-center">
                {title}
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-white whitespace-pre-line text-center mb-4">
                {description}
              </p>
              {isDoorPhase && warningText && (
                <div className="mt-2 mb-6 w-full p-4 rounded-lg bg-red-900/40 border border-red-500/30 backdrop-blur-md">
                  <p className="text-sm text-red-300 leading-relaxed font-semibold text-center">
                    ⚠ {warningText}
                  </p>
                </div>
              )}
              
              <div className="w-full">
                <FlagSubmission targetFlagNumber={challenge?.flag_number} />
              </div>
            </div>
          </div>

          {/* Door Phase Visual Reward */}
          <div className={`hidden md:flex flex-col items-center justify-center transition-all duration-1000 ${isDoorPhase ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none absolute right-0"}`}>
             <div className="w-16 h-24 border-2 border-red-500/50 rounded-t-full relative shadow-[0_0_40px_rgba(239,68,68,0.3)] animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent rounded-t-full"></div>
                <div className="absolute top-1/2 right-2 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_rgba(248,113,113,0.8)]"></div>
             </div>
             <div className="mt-4 text-xs font-mono tracking-widest text-red-500/80">THRESHOLD</div>
          </div>

        </div>
      )}
    </main>
  );
}
