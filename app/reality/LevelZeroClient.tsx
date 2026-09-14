"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import IntroSequence from "@/components/IntroSequence";
import SuccessOverlay from "@/components/SuccessOverlay";
import lore from "../../.lore.json"; // fallback if description isn't in DB

interface LevelZeroClientProps {
  challenge: any;
}

export default function LevelZeroClient({ challenge }: LevelZeroClientProps) {
  const [introFinished, setIntroFinished] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.trim().toLowerCase() === "sydney") {
        setShowSuccess(true);
        setShowError(false);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    }
  };
  
  // Use DB description if available, else fallback to local JSON
  const description = challenge?.description || lore.challenges[0].description;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white flex">
      {/* Intro Sequence Overlay */}
      {!introFinished && (
        <IntroSequence 
          asOverlay={true} 
          onComplete={() => setIntroFinished(true)} 
        />
      )}

      {/* Error Toast */}
      <div 
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
          showError ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium tracking-wide text-sm">Incorrect submission. Try again.</span>
        </div>
      </div>

      {/* Success Overlay Component */}
      <SuccessOverlay show={showSuccess} nextLevelUrl="/level/1" />

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
        <div className="relative z-10 ">
          <div className="rounded-lg bg-black/40 p-6 backdrop-blur-md border border-white/10 shadow-2xl">
            <h1 className="mb-4 text-2xl font-bold tracking-widest text-blue-200">PROLOGUE</h1>
            <p className="text-lg leading-relaxed text-gray-200">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Ticket Image */}
      <div className="h-screen flex-shrink-0 p-4 pr-18 bg-black flex items-center justify-center">
        <div className="relative h-full aspect-[9/16] max-w-full overflow-hidden rounded-3xl shadow-2xl bg-black">
          <Image
            src="/ticket.png"
            alt="Flight Ticket to Sydney"
            fill
            sizes="(max-width: 1024px) 100vw, 56vh"
            className="object-cover object-center select-none pointer-events-none"
            priority
          />

          {/* Instagram Story Bottom Interaction Bar Overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-[4.5%] pb-[4%] pt-4 flex items-center gap-[3%] z-20">
            {/* Pill Input Container - Almost Transparent */}
            <div className="relative flex-1 flex items-center bg-white/[0.04] hover:bg-white/[0.08] focus-within:bg-white/[0.10] backdrop-blur-[2px] rounded-full border border-white/20 px-4 py-2.5 transition-all duration-200">
              <input
                type="text"
                placeholder="Send message (hint: sydney)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSubmit}
                className="w-full bg-transparent text-[14px] sm:text-[15px] text-white placeholder-white/50 outline-none pr-6 font-normal tracking-tight"
              />
            </div>

            {/* Like Button */}
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className="p-1.5 transition-transform active:scale-125 hover:opacity-90 focus:outline-none flex items-center justify-center cursor-pointer"
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
              className="p-1.5 transition-transform active:scale-110 hover:opacity-80 focus:outline-none flex items-center justify-center cursor-pointer"
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
      </div>
    </main>
  );
}
