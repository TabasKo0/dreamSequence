"use client";

import { useState } from "react";
import SuccessOverlay from "@/components/SuccessOverlay";

export default function LevelTwoClient({ challenge }: { challenge: any }) {
  const [inputValue, setInputValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.trim().toLowerCase() === "level2") {
        setShowSuccess(true);
        setShowError(false);
      } else {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-8">
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

      <SuccessOverlay show={showSuccess} nextLevelUrl="/level-3" />

      <div className="max-w-2xl w-full space-y-8 z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-widest text-blue-300 mb-4">{challenge?.title || "LEVEL 2"}</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            {challenge?.description || "Level 2. The dream is deeper now."}
          </p>
        </div>
        
        <div className="relative flex items-center bg-white/[0.04] hover:bg-white/[0.08] focus-within:bg-white/[0.10] backdrop-blur-md rounded-xl border border-white/20 px-6 py-4 transition-all duration-200">
          <input
            type="text"
            placeholder="Enter flag (hint: level2)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleSubmit}
            className="w-full bg-transparent text-lg text-white placeholder-white/50 outline-none font-normal tracking-tight"
          />
        </div>
      </div>
    </main>
  );
}
