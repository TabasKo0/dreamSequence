"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../app/intro/intro.module.css";

interface IntroSequenceProps {
  text?: string;
  redirectUrl?: string;
  onComplete?: () => void;
}

export default function IntroSequence({
  text = "There's a version of this page waiting on the other side of this sentence. Finish reading, then open the door.",
  redirectUrl = "/dashboard",
  onComplete
}: IntroSequenceProps) {
  const router = useRouter();
  const [textIndex, setTextIndex] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [revealStage, setRevealStage] = useState(0);

  // Typewriter effect
  useEffect(() => {
    // Respect prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      if (onComplete) {
        onComplete();
      } else {
        router.push(redirectUrl);
      }
      return;
    }

    if (revealStage > 0) return; // Don't type if we're revealing

    if (textIndex < text.length) {
      const timer = setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, 32 + Math.random() * 28);
      return () => clearTimeout(timer);
    } else {
      setTypingDone(true);
    }
  }, [textIndex, revealStage, router, text, onComplete, redirectUrl]);

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
      // Stage 5: Animation complete
      if (onComplete) {
        onComplete();
      } else {
        router.push(redirectUrl);
      }
    }

    return () => clearTimeout(timer);
  }, [revealStage, router, onComplete, redirectUrl]);

  // Global click / keydown handler
  useEffect(() => {
    const handleAdvance = (e: MouseEvent | KeyboardEvent) => {
      if (e.type === 'keydown' && (e as KeyboardEvent).key === 'Tab') return;
      
      if (!typingDone) {
        // Fast-forward typing
        setTextIndex(text.length);
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
  }, [typingDone, revealStage, text.length]);

  // Determine classes based on stages
  const topPanelClasses = [
    styles.panelTop,
    revealStage >= 4 ? styles.panelTopSeam : "",
    revealStage >= 4 ? styles.panelTopSlide : ""
  ].join(" ");

  const bottomPanelClasses = [
    styles.panelBottom,
    revealStage >= 4 ? styles.panelBottomSeam : "",
    revealStage >= 4 ? styles.panelBottomSlide : ""
  ].join(" ");

  const orbClasses = [
    styles.orb,
    revealStage >= 2 ? styles.orbShow : "",
    revealStage >= 4 ? styles.orbBurst : ""
  ].join(" ");

  const lineClasses = [
    styles.line,
    revealStage >= 3 ? styles.lineExtend : "",
    revealStage >= 4 ? styles.lineFade : ""
  ].join(" ");

  // Prevent rendering if finished (navigation takes over)
  if (revealStage === 5) return null;

  return (
    <div className={styles.bg}>
      <div className={styles.intro} aria-hidden="false">
        <div className={topPanelClasses}></div>
        <div className={bottomPanelClasses}></div>

        <div className={`${styles.typewriterWrap} ${revealStage >= 1 ? styles.typewriterWrapFadeOut : ""}`}>
          <p className={styles.typewriter}>
            <span>{text.substring(0, textIndex)}</span>
            <span className={styles.cursor} aria-hidden="true">&nbsp;</span>
          </p>
        </div>
        
        <div className={`${styles.hint} ${typingDone && revealStage === 0 ? styles.hintVisible : ""}`}>
          click, or press any key
        </div>

        <div className={styles.orbWrap}>
          <div className={orbClasses}></div>
        </div>
        <div className={lineClasses}></div>
      </div>
    </div>
  );
}
