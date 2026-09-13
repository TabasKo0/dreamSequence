"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const fullText = "There's a version of this page waiting on the other side of this sentence. Finish reading, then open the door.";

export default function IntroPage() {
  const router = useRouter();
  const [textIndex, setTextIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [revealStage, setRevealStage] = useState(0);

  // Typewriter effect
  useEffect(() => {
    // Respect prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      router.push('/dashboard');
      return;
    }

    if (revealStage > 0) return; // Don't type if we're revealing

    if (textIndex < fullText.length) {
      const timer = setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, 32 + Math.random() * 28);
      return () => clearTimeout(timer);
    } else {
      setTypingDone(true);
    }
  }, [textIndex, revealStage, router]);

  // Reveal sequence timings
  useEffect(() => {
    if (revealStage === 0) return;

    let timer: NodeJS.Timeout;

    if (revealStage === 1) {
      // Stage 1: Fade out text, wait 550ms for Orb to show
      timer = setTimeout(() => setRevealStage(2), 550);
    } else if (revealStage === 2) {
      // Stage 2: Orb shows, wait 500ms for Line to extend (1050ms total from start)
      timer = setTimeout(() => setRevealStage(3), 500);
    } else if (revealStage === 3) {
      // Stage 3: Line extends (takes 950ms), wait extra 220ms beat = 1170ms total
      timer = setTimeout(() => setRevealStage(4), 1170);
    } else if (revealStage === 4) {
      // Stage 4: Burst & panels slide (takes 1150ms)
      timer = setTimeout(() => setRevealStage(5), 1150);
    } else if (revealStage === 5) {
      // Stage 5: Animation complete, navigate away
      router.push('/dashboard');
    }

    return () => clearTimeout(timer);
  }, [revealStage, router]);

  // Global click / keydown handler
  useEffect(() => {
    const handleAdvance = (e: MouseEvent | KeyboardEvent) => {
      if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Tab') return;
      
      if (!typingDone) {
        // Fast-forward typing
        setTextIndex(fullText.length);
        setTypingDone(true);
      } else if (revealStage === 0) {
        // Begin reveal sequence
        setRevealStage(1);
      }
    };

    document.addEventListener('click', handleAdvance);
    document.addEventListener('keydown', handleAdvance);

    return () => {
      document.removeEventListener('click', handleAdvance);
      document.removeEventListener('keydown', handleAdvance);
    };
  }, [typingDone, revealStage]);

  // Determine classes based on stages
  const topPanelClasses = [
    "intro-panel-top",
    revealStage >= 4 ? "intro-panel-top-seam" : "",
    revealStage >= 4 ? "intro-panel-top-slide" : ""
  ].filter(Boolean).join(" ");

  const bottomPanelClasses = [
    "intro-panel-bottom",
    revealStage >= 4 ? "intro-panel-bottom-seam" : "",
    revealStage >= 4 ? "intro-panel-bottom-slide" : ""
  ].filter(Boolean).join(" ");

  const orbClasses = [
    "intro-orb",
    revealStage >= 2 ? "intro-orb-show" : "",
    revealStage >= 4 ? "intro-orb-burst" : ""
  ].filter(Boolean).join(" ");

  const lineClasses = [
    "intro-line",
    revealStage >= 3 ? "intro-line-extend" : "",
    revealStage >= 4 ? "intro-line-fade" : ""
  ].filter(Boolean).join(" ");

  // Prevent rendering if finished (navigation takes over)
  if (revealStage === 5) return null;

  return (
    <div className="intro-bg">
      <div className="intro-container" aria-hidden="false">
        <div className={topPanelClasses}></div>
        <div className={bottomPanelClasses}></div>

        <div className={`intro-typewriter-wrap ${revealStage >= 1 ? "intro-typewriter-wrap-fade-out" : ""}`}>
          <p className="intro-typewriter">
            <span>{fullText.substring(0, textIndex)}</span>
            <span className="intro-cursor" aria-hidden="true">&nbsp;</span>
          </p>
        </div>
        
        <div className={`intro-hint ${typingDone && revealStage === 0 ? "intro-hint-visible" : ""}`}>
          click, or press any key
        </div>

        <div className="intro-orb-wrap">
          <div className={orbClasses}></div>
        </div>
        <div className={lineClasses}></div>
      </div>
    </div>
  );
}
