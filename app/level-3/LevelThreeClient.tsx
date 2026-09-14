"use client";

import FlagSubmission from "@/components/FlagSubmission";
import lore from "../../.lore.json";

export default function LevelThreeClient({ challenge }: { challenge: any }) {
  const loreChallenge = lore.challenges.find((c) => c.sequence === challenge?.flag_number) || lore.challenges.find((c) => c.stage === "level-3");
  const title = challenge?.title || loreChallenge?.title || "LEVEL 3";
  const description = challenge?.description || loreChallenge?.description || "Welcome to Level 3.";

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-widest text-blue-400 mb-4">{title}</h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-8 whitespace-pre-line">
            {description}
          </p>
        </div>
        
        <FlagSubmission targetFlagNumber={challenge?.flag_number} />
      </div>
    </main>
  );
}
