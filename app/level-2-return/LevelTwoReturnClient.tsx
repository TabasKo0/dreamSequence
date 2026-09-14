"use client";

import { useState } from "react";
import FlagSubmission from "@/components/FlagSubmission";
import IntroSequence from "@/components/IntroSequence";
import lore from "../../.lore.json";

export default function LevelTwoReturnClient({ challenge }: { challenge: any }) {
  const [introFinished, setIntroFinished] = useState(challenge?.flag_number !== 11);

  const loreChallenge = lore.challenges.find((c) => c.sequence === challenge?.flag_number) || lore.challenges.find((c) => c.stage === "level-2-return");
  const title = loreChallenge?.title || challenge?.title || "Back Through Level 2";
  const description = loreChallenge?.description || challenge?.description || "";
  
  const currentIntroText = lore.stages.find(s => s.id === "level-2-return")?.intro_text || "";

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
        <div className="relative max-w-2xl w-full rounded-[2rem] bg-gradient-to-r from-white-800/40 to-white-900/40 border border-white/50 backdrop-blur-xs p-8 shadow-2xl overflow-hidden transition-all duration-500 z-10 animate-in fade-in duration-1000 flex flex-col items-center">
          <div className="absolute inset-0 bg-white/5"></div>
          <div className="absolute top-0 left-1/4 w-1/3 h-full bg-white-500/10 blur-[6px] -z-10"></div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <h1 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)] text-center">
              {title}
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-white whitespace-pre-line text-center mb-8">
              {description}
            </p>
            
            <div className="w-full">
              <FlagSubmission targetFlagNumber={challenge?.flag_number} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
