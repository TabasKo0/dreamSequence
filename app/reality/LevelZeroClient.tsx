"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import IntroSequence from "@/components/IntroSequence";
import FlagSubmission from "@/components/FlagSubmission";
import lore from "../../.lore.json";

interface LevelZeroClientProps {
  challenge: any;
}

export default function LevelZeroClient({ challenge }: LevelZeroClientProps) {
  const [introFinished, setIntroFinished] = useState(challenge?.flag_number !== 1);
  const [isLiked, setIsLiked] = useState(false);
  
  const loreChallenge = lore.challenges.find((c) => c.sequence === challenge?.flag_number) || lore.challenges.find((c) => c.stage === "reality");
  const title = loreChallenge?.title || challenge?.title || "PROLOGUE";
  const description = loreChallenge?.description || challenge?.description || "";
  
  const currentIntroText = lore.stages.find(s => s.id === "reality")?.intro_text || "";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white flex">
      {!introFinished && (
        <IntroSequence 
          asOverlay={true} 
          text={currentIntroText}
          onComplete={() => setIntroFinished(true)} 
        />
      )}

      {/* Left Side: Airplane Window View & Text */}
      <div className="relative flex-1 h-screen flex flex-col justify-end p-18">
        {/* Former Background Image */}
        <Image
          src="/level_0.png"
          alt="Airplane Window View"
          fill
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover object-center opacity-90"
          priority
        />
        
        {/* Black gradient overlay over the image */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/40 to-transparent"></div>

        {/* Story Text */}
        {introFinished && (
          <div className="relative z-10 animate-in fade-in duration-1000">
            <div className="rounded-lg bg-black/40 p-6 backdrop-blur-md border border-white/10 shadow-2xl">
              <h1 className="mb-4 text-2xl font-bold tracking-widest text-blue-200">{title}</h1>
              <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-line mb-6">
                {description}
              </p>
              
              {challenge?.link && (
                <div className="flex justify-start w-full">
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
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Ticket Image or Portal */}
      {introFinished && (
        <div className="h-screen flex-shrink-0 p-4 pr-18 bg-black flex items-center justify-center animate-in fade-in duration-1000">
        {challenge?.flag_number === 1 || !challenge?.flag_number ? (
          <div className="relative h-full aspect-[10/16] max-w-full overflow-hidden rounded-3xl shadow-2xl bg-black">
            <Image
              src="/ticket.png"
              alt="Flight Ticket to Sydney"
              fill
              sizes=" 120vw, 56vh"
              className="object-cover object-center select-none pointer-events-none"
              priority
            />

            {/* Instagram Story Bottom Interaction Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-[4.5%] pb-[4%] pt-4 flex items-center gap-[3%] z-20 bg-gradient-to-t from-black/80 to-transparent">
              <div className="relative flex-1 flex items-center">
                <FlagSubmission targetFlagNumber={1} variant="pill" />
              </div>

              {/* Like Button */}
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className="p-1.5 transition-transform active:scale-125 hover:opacity-90 focus:outline-none flex items-center justify-center cursor-pointer mb-2"
                aria-label="Like story"
              >
                {isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ff3040"
                    className="w-7 h-7 drop-shadow-[0_0_8px_rgba(255,48,64,0.6)] animate-in zoom-in-50 duration-200"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-7 h-7 text-white drop-shadow-md"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                )}
              </button>

              {/* Direct Message (Paper Airplane) Button */}
              <Link
                href="https://www.instagram.com/acmw_vitc/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 transition-transform active:scale-110 hover:opacity-80 focus:outline-none flex items-center justify-center cursor-pointer mb-2"
                aria-label="Direct message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-7 h-7 text-white -rotate-12 drop-shadow-md"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : challenge?.flag_number === 2 ? (
          <div className="relative w-full max-w-sm rounded-[2rem] bg-gradient-to-r from-white-800/40 to-white-900/40 border border-white/50 backdrop-blur-xs p-8 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-6">
            <div className="absolute inset-0 bg-white/5"></div>
            <div className="absolute top-0 left-1/4 w-1/3 h-full bg-white-500/10 blur-[6px] -z-10"></div>
            <div className="relative z-10 w-full flex flex-col items-center gap-6">
              <h2 className="text-xl font-semibold text-white tracking-wide text-center">Second Checkpoint</h2>
              <Link
                href="https://saito-airlines.onrender.com/"
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Access Flight Portal
              </Link>
              <div className="w-full">
                <FlagSubmission targetFlagNumber={2} />
              </div>
            </div>
          </div>
        ) : null}
        </div>
      )}
    </main>
  );
}
