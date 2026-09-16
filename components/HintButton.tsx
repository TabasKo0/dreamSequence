"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HintButtonProps {
  flagNumber?: number;
  unlockedHints?: number[];
}

export default function HintButton({ flagNumber, unlockedHints = [] }: HintButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const [hintText, setHintText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<boolean>(false);

  // If flagNumber is undefined, we shouldn't render the button
  if (flagNumber === undefined || flagNumber === null) {
    return null;
  }

  const isAlreadyUnlocked = unlockedHints.includes(flagNumber);

  useEffect(() => {
    let isMounted = true;

    async function fetchUnlockedHint() {
      if (isAlreadyUnlocked && !hintText) {
        setLoading(true);
        setError(null);
        try {
          const { data, error: rpcError } = await supabase.rpc("unlock_hint", { p_flag_number: flagNumber });
          if (rpcError) {
            throw new Error(rpcError.message);
          }
          if (isMounted) {
            setHintText(data as string);
          }
        } catch (err: any) {
          if (isMounted) {
            setError(err.message || "Failed to fetch unlocked hint");
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    }

    fetchUnlockedHint();

    return () => {
      isMounted = false;
    };
  }, [flagNumber, isAlreadyUnlocked, hintText, supabase]);

  const handleUnlock = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc("unlock_hint", { p_flag_number: flagNumber });
      
      if (rpcError) {
        throw new Error(rpcError.message);
      }
      
      setHintText(data as string);
      
      // Refresh to get updated team state (score, unlocked_hints) from server
      router.refresh();
      
    } catch (err: any) {
      setError(err.message || "Failed to unlock hint");
      setConfirming(false); // Reset confirmation state on error
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirm = () => {
    setConfirming(false);
  };

  if (hintText) {
    return (
      <div className="w-full my-4 p-4 rounded-xl bg-red-300/5 border border-red-500/10 backdrop-blur-md animate-in fade-in">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          Hint
        </h4>
        <p className="text-sm text-blue-100 whitespace-pre-line">{hintText}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center my-4 animate-in fade-in">
      {isAlreadyUnlocked && loading ? (
        <div className="text-sm text-white/50 flex items-center gap-2 animate-pulse bg-white/5 px-4 py-2 rounded-lg border border-white/10">
          <svg className="animate-spin h-4 w-4 text-white/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Decrypting unlocked hint...
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {error && <p className="text-xs text-red-400 font-semibold text-center bg-red-900/20 px-3 py-1.5 rounded-lg border border-red-500/30">{error}</p>}
          
          <div className="flex gap-2">
            <button
              onClick={handleUnlock}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 border ${
                confirming 
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]" 
                  : "bg-white/10 hover:bg-white/20 text-white/90 border-white/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Unlocking...
                </>
              ) : confirming ? (
                "Confirm: Deduct 10 Points?"
              ) : (
                "Unlock Hint (-10 Points)"
              )}
            </button>
            
            {confirming && !loading && (
              <button
                onClick={handleCancelConfirm}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
