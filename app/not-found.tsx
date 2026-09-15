import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
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

      {/* Content 
      <div className="relative z-10 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
        <div className="rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md p-10 md:p-14 shadow-2xl flex flex-col items-center text-center max-w-lg w-[90%] mx-auto">
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter text-red-500 drop-shadow-[0_0_25px_rgba(220,38,38,0.5)] mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-gray-200 mb-6 uppercase">
            Lost in the Layers
          </h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-8">
            You've wandered too deep into the dream. There's nothing to find here. It's time to wake up before the projection collapses.
          </p>

          <Link
            href="/"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md bg-white/10 px-8 py-3 text-sm font-semibold tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] border border-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:-translate-x-1">
                <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
              </svg>
              RETURN TO REALITY
            </span>
          </Link>
        </div>
      </div>*/}
    </main>
  );
}
