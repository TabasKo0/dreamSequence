import Link from "next/link";

interface SuccessOverlayProps {
  show: boolean;
  nextLevelUrl: string;
}

export default function SuccessOverlay({ show, nextLevelUrl }: SuccessOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-500 animate-in fade-in">
      <div className="bg-black/30 border border-rose-300/20 p-10 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.1)] text-center max-w-sm w-full mx-4 backdrop-blur-2xl animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-rose-400/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,113,133,0.2)] border border-rose-300/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Challenge Cleared</h2>
        <p className="text-rose-200/70 mb-8 text-sm">Destination confirmed. The next sequence awaits.</p>
        <Link
          href={nextLevelUrl}
          className="inline-flex w-full items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-rose-300/30 text-rose-100 font-semibold text-base transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(251,113,133,0.2)]"
        >
          Enter Next Level
        </Link>
      </div>
    </div>
  );
}
