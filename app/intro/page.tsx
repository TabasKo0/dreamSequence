"use client";

import IntroSequence from "@/components/IntroSequence";
import lore from "../../.lore.json";

export default function IntroPage() {
  return (
    <main className="relative min-h-screen w-full bg-black">
      <IntroSequence 
        text={lore.ctf_event.overview}
        redirectUrl="/dashboard"
      />
    </main>
  );
}
