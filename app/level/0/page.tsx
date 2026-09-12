"use client";

import Image from "next/image";
import IntroSequence from "@/components/IntroSequence";
import { useState } from "react";
import lore from "../../../.lore.json";

export default function LevelZeroPage() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white flex">
      {/* Intro Sequence Overlay */}
      {!introFinished && (
        <IntroSequence 
          asOverlay={true} 
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
          className="object-cover object-center opacity-90"
          priority
        />
        
        {/* Black gradient overlay over the image */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/40 to-transparent"></div>

        {/* Story Text */}
        <div className="relative z-10 max-w-xl">
          <div className="rounded-lg bg-black/40 p-6 backdrop-blur-md border border-white/10 shadow-2xl">
            <h1 className="mb-4 text-2xl font-bold tracking-widest text-blue-200">PROLOGUE</h1>
            <p className="text-lg leading-relaxed text-gray-200">
              {lore.challenges[0].description}
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Ticket Image */}
      <div className="h-screen flex-shrink-0 p-4 pr-18 bg-black">
        <div className="relative h-full">
          <Image
            src="/ticket.png"
            alt="Flight Ticket to Sydney"
            width={1080}
            height={1920}
            className="h-full w-auto object-cover shadow-2xl"
            priority
          />
        </div>
      </div>
    </main>
  );
}
