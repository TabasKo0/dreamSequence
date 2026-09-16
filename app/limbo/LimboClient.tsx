"use client";

import { useState } from "react";
import FlagSubmission from "@/components/FlagSubmission";
import HintButton from "@/components/HintButton";
import IntroSequence from "@/components/IntroSequence";
import RippleDistortion from "./ripple";
import lore from "../../.lore.json";

export default function LimboClient({ challenge, team }: { challenge: any, team: any }) {
  const [introFinished, setIntroFinished] = useState(challenge?.flag_number !== 9);
  
  // Flag 9 is the Limbo flag
  const activeTab = 9;

  const activeLore = lore.challenges.find((c) => c.sequence === activeTab) || lore.challenges.find((c) => c.stage === "limbo");
  const title = activeLore?.title || challenge?.title || "LIMBO";
  const description = activeLore?.description || challenge?.description || "There are no walls here.";
  
  const currentIntroText = lore.stages.find(s => s.id === "limbo")?.intro_text || "";

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Ripple Effect */}
      <div className="absolute inset-0 z-0">
        <RippleDistortion
          src="/limbo.png" // using level_3.png as a placeholder for the blank background with ripple
          brushSize={150}
          strength={0.01}
          swirl={0}
          rings={4}
          spread={5}
          fade={3}
          spacing={15}
          dispersion={0}
          glint={0}
          tint="#a855f7"
          tintAmount={0.1}
          highlightColor="#ffffff"
          trigger="hover"
          clickStrength={2}
          quality="low"
          enabled
        />
        {/* Overlay to darken the background further to make it look "blank" for now */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
      </div>

      {/* Intro Sequence Overlay */}
      {!introFinished && (
        <IntroSequence 
          asOverlay={true} 
          text={currentIntroText}
          onComplete={() => setIntroFinished(true)} 
        />
      )}

      {introFinished && (
        <div className="absolute inset-0 w-full h-full animate-in fade-in duration-1000 flex flex-col items-center justify-center pointer-events-none">
          
          {/* CENTER DIALOGUE BOX */}
          <div className="relative w-[90%] max-w-md z-30 pointer-events-auto">
            <div className="relative w-full rounded-[2rem] bg-gradient-to-r from-white-800/20 to-white-900/20 border border-white/30 backdrop-blur-md p-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-500">
              <div className="absolute inset-0 bg-white/5"></div>
              <div className="absolute top-0 left-1/4 w-1/3 h-full bg-white-500/10 blur-[6px] -z-10"></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                <h1 className="text-base mb-4 text-3xl md:text-4xl font-bold tracking-tight montserrat-bold text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] text-center">
                  {title}
                </h1>
                <p className="text-base md:text-lg leading-relaxed text-gray-300 whitespace-pre-line text-center mb-6">
                  {description}
                </p>

                <HintButton 
                  flagNumber={activeTab} 
                  unlockedHints={team?.unlocked_hints} 
                  key={activeTab}
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
          
        </div>
      )}
    </main>
  );
}
