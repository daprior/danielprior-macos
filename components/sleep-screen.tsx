"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppleIcon } from "@/components/icons";
import { useSystemStore } from "@/store/useSystemStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SleepScreen() {
  const wakeUp = useSystemStore((s) => s.wakeUp);
  const [showWakeText, setShowWakeText] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);
  const isWakingRef = useRef(false);

  useEffect(() => {
    prefersReducedMotionRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useGSAP(
    () => {
      const rootEl = rootRef.current;
      if (!rootEl) return;
      if (prefersReducedMotionRef.current) return;

      gsap.set(rootEl, { opacity: 0 });
      gsap.to(rootEl, {
        opacity: 1,
        duration: 0.22,
        ease: "power2.out",
        clearProps: "opacity",
      });
    },
    { dependencies: [] },
  );

  const beginWake = useCallback(() => {
    if (isWakingRef.current) return;
    isWakingRef.current = true;

    if (prefersReducedMotionRef.current) {
      wakeUp();
      return;
    }

    const rootEl = rootRef.current;
    if (!rootEl) {
      wakeUp();
      return;
    }

    gsap.to(rootEl, {
      opacity: 0,
      duration: 0.18,
      ease: "power2.inOut",
      onComplete: wakeUp,
    });
  }, [wakeUp]);

  useEffect(() => {
    const onKeyDown = () => beginWake();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [beginWake]);

  useEffect(() => {
    // Show the "Click to wake up" text after a delay
    const timer = setTimeout(() => {
      setShowWakeText(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={rootRef}
      className="h-screen w-screen bg-black flex flex-col items-center justify-center cursor-pointer"
      onMouseDown={beginWake}
    >
      <AppleIcon className="w-20 h-20 text-white mb-8 opacity-30" />

      {showWakeText && (
        <p className="text-white text-lg opacity-50 animate-pulse">
          Click to wake up
        </p>
      )}
    </div>
  );
}
