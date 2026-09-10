"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      if (error.message.includes("Access Denied: Your email is not on the CTF allowlist.")) {
        setErrorMsg("Registration failed: Your email is not on the approved invite list. Please contact the organizers.");
      } else {
        setErrorMsg(error.message);
      }
      setIsLoading(false);
    } else {
      setSuccessMsg("Registration successful! You can now log in.");
      setActiveTab("login");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-start justify-center pt-[15vh] bg-[#0d1520] bg-[url('/balls1.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white p-6 relative overflow-hidden">
      
      {/* EDIT FOG OPACITY HERE (change opacity-50 to adjust thickness) */}
      <div ref={vantaRef} className="absolute inset-0 z-0 pointer-events-none opacity-50"></div>

      <div className="z-10 w-full max-w-md relative">
        {/* Tab Container */}
        <div className="rounded-t-[2rem] bg-white/5 border border-white/50 border-b-0 backdrop-blur-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="flex relative z-10">
            <button
              onClick={() => {
                setActiveTab("login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`flex-1 py-5 text-sm font-semibold tracking-widest uppercase transition-all duration-300 relative ${
                activeTab === "login" ? "text-red-400 bg-white/5" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              Sign In
              {activeTab === "login" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
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
            
            {errorMsg && (
              <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
                {successMsg}
              </div>
            )}

            {activeTab === "login" ? (
              <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    required
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    required
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="mt-4 w-full bg-white/10 border border-white/30 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSignUp}>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username" 
                    required
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    required
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password" 
                    required
                    className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all shadow-inner"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="mt-4 w-full bg-white/10 border border-white/30 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all shadow-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
      </div>
  );
}
