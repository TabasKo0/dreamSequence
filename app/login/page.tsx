"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    let effect: any = null;
    
    const initVanta = async () => {
      if (!vantaEffect) {
        // Dynamically import THREE and Vanta to prevent SSR errors
        const THREE = await import("three");
        const FOG = (await import("vanta/dist/vanta.fog.min")).default;
        
        effect = FOG({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0xa6b4d1,
          midtoneColor: 0x2a2a36,
          lowlightColor: 0x5290bb,
          baseColor: 0x955050,
          speed: 5.0
        });
        setVantaEffect(effect);
      }
    };
    
    initVanta();

    return () => {
      if (effect) effect.destroy();
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div className="flex min-h-screen w-full items-start justify-center pt-[15vh] bg-[#0d1520] bg-[url('/balls1.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white p-6 relative overflow-hidden">
      
      {/* EDIT FOG OPACITY HERE (change opacity-50 to adjust thickness) */}
      <div ref={vantaRef} className="absolute inset-0 z-0 pointer-events-none opacity-50"></div>

      <div className="z-10 w-full max-w-md relative">
       {/* <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
             <h2 className="text-2xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-md">DREAM SEQUENCE</h2>
          </Link>
        </div> */}

        {/* Tab Container */}
        <div className="rounded-t-[2rem] bg-white/5 border border-white/50 border-b-0 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="flex relative z-10">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-5 text-sm font-semibold tracking-widest uppercase transition-all duration-300 relative ${
                activeTab === "login" ? "text-red-400 bg-white/5" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              Login
              {activeTab === "login" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-5 text-sm font-semibold tracking-widest uppercase transition-all duration-300 relative ${
                activeTab === "signup" ? "text-red-400 bg-white/5" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              Sign Up
              {activeTab === "signup" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              )}
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-b-[2rem] bg-white/5 border border-white/50 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="p-8 relative z-10 border-t border-white/20">
            {activeTab === "login" ? (
              <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs text-red-400 hover:text-red-300 transition-colors">Forgot?</a>
                  </div>
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <button type="submit" className="mt-4 w-full bg-white/10 border border-white/30 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all shadow-lg backdrop-blur-sm">
                  Sign In
                </button>
              </form>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Username</label>
                  <input 
                    type="text" 
                    placeholder="Choose a username" 
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Password</label>
                  <input 
                    type="password" 
                    placeholder="Create a password" 
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <button type="submit" className="mt-4 w-full bg-white/10 border border-white/30 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all shadow-lg backdrop-blur-sm">
                  Create Account
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
      </div>
  );
}
