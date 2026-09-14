"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus, createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { verifyFlagAction } from "@/app/actions/submitFlag";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`p-2 rounded-xl font-medium transition-all duration-200 
        ${pending ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-red-400 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(235,99,37,0.4)]"}`}
    >
      {pending ? "Verifying..." : "Submit Flag"}
    </button>
  );
}

function PillInput() {
  const { pending } = useFormStatus();
  return (
    <input
      type="text"
      name="flag"
      disabled={pending}
      placeholder={pending ? "Verifying..." : "Send message "}
      className="w-full bg-transparent text-[14px] sm:text-[15px] text-white placeholder-white/50 outline-none pr-6 font-normal tracking-tight"
    />
  );
}

export default function FlagSubmission({ targetFlagNumber, variant = "default" }: { targetFlagNumber: number, variant?: "default" | "pill" }) {
  const [state, formAction] = useActionState(verifyFlagAction, null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state?.success) {
      setShowSuccessModal(true);
    }
  }, [state]);

  const handleContinue = () => {
    setShowSuccessModal(false);
    router.refresh();
    if (state?.nextUrl) {
      router.push(state.nextUrl);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      {showSuccessModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-500 animate-in fade-in">
          <div className="bg-black/60 border border-green-500/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.15)] text-center max-w-sm w-full mx-4 backdrop-blur-xl animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Target Acquired</h2>
            <p className="text-green-200/70 mb-8 text-sm">Flag accepted. The next sequence awaits.</p>
            <button
              onClick={handleContinue}
              className="inline-flex w-full items-center justify-center px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-base transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Continue
            </button>
          </div>
        </div>,
        document.body
      )}

      {variant === "pill" ? (
        <>
          <form action={formAction} className="relative flex-1 flex items-center bg-white/[0.04] hover:bg-white/[0.08] focus-within:bg-white/[0.10] backdrop-blur-[2px] rounded-full border border-white/20 px-4 py-2.5 transition-all duration-200">
            <input type="hidden" name="targetFlagNumber" value={targetFlagNumber} />
            <PillInput />
          </form>
          {state && !state.success && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] transition-all duration-300 transform translate-y-0 opacity-100">
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-100 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium tracking-wide text-sm">{state.message || "Incorrect submission. Try again."}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <form action={formAction} className="flex flex-col justify-center items-center gap-3 w-full max-w-md mx-auto">
          <input type="hidden" name="targetFlagNumber" value={targetFlagNumber} />
          
          <div className="flex gap-2">
            <input
              type="text"
              name="flag"
              placeholder="ACMW{...}"
              required
              className="flex bg-white/[0.04] hover:bg-white/[0.08] focus:bg-white/[0.12] border border-white/20 rounded-xl p-2 text-white placeholder-white/50 outline-none transition-all duration-200"
            />
            <SubmitButton />
          </div>

          {state && !state.success && (
            <p className="text-sm font-medium text-center text-red-400">
              {state.message}
            </p>
          )}
        </form>
      )}
    </>
  );
}
