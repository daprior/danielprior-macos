"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppleIcon } from "@/components/icons";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSystemStore } from "@/store/useSystemStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ShutdownScreen() {
  // System state
  const boot = useSystemStore((state) => state.boot);

  // Settings state
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  const [showBootText, setShowBootText] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);
  const isBootingRef = useRef(false);

  useEffect(() => {
    prefersReducedMotionRef.current =
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false) ||
      reduceMotion;

    // Show the "Click to boot" text after a delay
    const timer = setTimeout(() => {
      setShowBootText(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [reduceMotion]);

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

  const beginBoot = useCallback(() => {
    if (isBootingRef.current) return;
    isBootingRef.current = true;

    if (prefersReducedMotionRef.current) {
      boot();
      return;
    }

    const rootEl = rootRef.current;
    if (!rootEl) {
      boot();
      return;
    }

    gsap.to(rootEl, {
      opacity: 0,
      duration: 0.18,
      ease: "power2.inOut",
      onComplete: boot,
    });
  }, [boot]);

  useEffect(() => {
    const onKeyDown = () => beginBoot();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [beginBoot]);

  return (
    <div
      ref={rootRef}
      className="h-screen w-screen bg-black flex flex-col items-center justify-center cursor-pointer"
      onMouseDown={beginBoot}
    >
      {showBootText ? (
        <div className="flex flex-col items-center">
          <AppleIcon className="w-20 h-20 text-white mb-8" />
          <p className="text-white text-lg animate-pulse">Click to boot</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-white text-lg mb-4">
            Your computer has been shut down
          </p>
          <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
