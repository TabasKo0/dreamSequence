import Link from "next/link";
import Image from "next/image";
import FlagSubmission from "@/components/FlagSubmission";
import HintButton from "@/components/HintButton";
import { createClient } from "@/lib/supabase/server";

export default async function NotFound() {
  const supabase = await createClient();
  
  // Hardcoded challenge details
  const title = "Lost in the Layers";
  const description = "You've wandered too deep into the dream. There's nothing to find here. It's time to wake up before the projection collapses.";
  
  // 👇👇👇 PASTE YOUR HARDCODED LINK HERE 👇👇👇
  const link = "YOUR_LINK_HERE"; 
  // 👆👆👆 PASTE YOUR HARDCODED LINK HERE 👆👆👆

  // Fetch team's unlocked hints if user is logged in
  let unlockedHints = [];
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("team_id")
      .eq("id", user.id)
      .single();
    
    if (profile?.team_id) {
      const { data: team } = await supabase
        .from("teams")
        .select("unlocked_hints")
        .eq("id", profile.team_id)
        .single();
        
      if (team?.unlocked_hints) {
        unlockedHints = team.unlocked_hints;
      }
    }
  }

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Image */}
      <Image
        src="/not_found.png"
        alt="Not Found Background"
        fill
        sizes="100vw"
        className="object-cover object-center opacity-70"
        priority
      />
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 w-full">
        <div className="rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md p-6 md:p-8 shadow-2xl flex flex-col items-center text-center max-w-lg w-[90%] mx-auto">
          <h1 className="text-5xl md:text-4xl font-black tracking-tighter text-red-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.5)] mb-2">
            404
          </h1>
          <h2 className="text-xl md:text-xl font-bold tracking-widest text-gray-200 mb-4 uppercase">
            {title}
          </h2>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed whitespace-pre-line mb-6">
            {description}
          </p>

          <div className="w-full flex flex-col items-center mb-6 gap-3">
            <HintButton flagNumber={14} unlockedHints={unlockedHints} />

            {link && (
              <a 
                href={link} 
                download
                className="px-5 py-2 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-wider hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                </svg>
                Download Resources
              </a>
            )}

            <div className="w-full flex flex-col items-center mt-2">
              <p className="text-xs text-red-400 font-semibold mb-3 uppercase tracking-wider">
                Warning: Solving this will lock all previous flags.
              </p>
              <div className="scale-90">
                <FlagSubmission targetFlagNumber={14} />
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md bg-white/10 px-6 py-2.5 text-xs font-semibold tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transition-transform group-hover:-translate-x-1">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              RETURN TO REALITY
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
