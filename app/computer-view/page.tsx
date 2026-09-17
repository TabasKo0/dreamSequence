import Link from "next/link";

export default function ComputerViewPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0d1520] bg-[url('/balls.png')] bg-cover bg-center bg-no-repeat bg-fixed text-white p-6 pb-28">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-0" />
      
      <div className="z-10 flex flex-col items-center justify-center text-center max-w-md bg-white/5 border border-white/10 p-10 rounded-3xl shadow-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 mb-6 text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
          <path d="M3 3.75A2.25 2.25 0 0 1 5.25 1.5h13.5A2.25 2.25 0 0 1 21 3.75v12a2.25 2.25 0 0 1-2.25 2.25H16.5v2.25A2.25 2.25 0 0 1 14.25 22.5h-4.5a2.25 2.25 0 0 1-2.25-2.25V18H5.25A2.25 2.25 0 0 1 3 15.75v-12ZM5.25 3a.75.75 0 0 0-.75.75v12c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-12a.75.75 0 0 0-.75-.75H5.25Z" />
          <path d="M9 19.5h6v1.5H9v-1.5Z" />
        </svg>

        <h1 className="text-3xl font-bold mb-4 tracking-wider text-red-500 font-montserrat">
          TERMINAL UPGRADE REQUIRED
        </h1>
        
        <p className="text-gray-300 text-lg leading-relaxed mb-8 font-alegreya">
          Your neural link is unstable on this frequency. The Dream Sequence requires a terminal with a wider viewport to fully interface. Please access from a desktop or laptop computer to continue your descent.
        </p>

        <Link href="/dashboard" className="w-full px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20 font-montserrat">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
