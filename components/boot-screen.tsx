"use client";

import { useEffect, useRef } from "react";
import { AppleIcon } from "@/components/icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ANIMATION_DELAYS_MS } from "@/constants/window-config";
import { useSystemStore } from "@/store/useSystemStore";

export default function BootScreen() {
  const systemState = useSystemStore((s) => s.systemState);
  const setSystemState = useSystemStore((s) => s.setSystemState);

  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    prefersReducedMotionRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const finishBoot = () => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    const currentState = useSystemStore.getState().systemState;
    if (currentState === "booting" || currentState === "restarting") {
      setSystemState("login");
    }
  };

  useGSAP(
    () => {
      const rootEl = rootRef.current;
      const fillEl = fillRef.current;
      if (!rootEl || !fillEl) return;

      if (prefersReducedMotionRef.current) {
        gsap.set(fillEl, { width: "100%" });
        finishBoot();
        return;
      }

      hasCompletedRef.current = false;
      gsap.set(fillEl, { width: "0%" });
      gsap.set(rootEl, { opacity: 0 });

      const timeline = gsap.timeline();

      timeline.to(
        rootEl,
        {
          opacity: 1,
          duration: 0.18,
          ease: "power2.out",
          clearProps: "opacity",
        },
        0,
      );

      timeline.to(
        fillEl,
        {
          width: "100%",
          duration: ANIMATION_DELAYS_MS.bootSequence / 1000,
          ease: "power2.inOut",
        },
        0,
      );

      timeline.to(rootEl, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.inOut",
        onComplete: finishBoot,
      });

      return () => {
        timeline.kill();
      };
    },
    { dependencies: [systemState] },
  );

  return (
    <div
      ref={rootRef}
      className="h-screen w-screen bg-black flex flex-col items-center justify-center"
    >
      <AppleIcon className="w-20 h-20 text-white mb-8" />
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div ref={fillRef} className="h-full bg-white rounded-full" />
      </div>
    </div>
  );
}
