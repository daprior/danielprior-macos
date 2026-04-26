"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ViewMode } from "@/types/apps/notes";

interface UseNotesContentAnimationProps {
  reduceMotion: boolean;
  selectedNoteId: string | number | null;
  viewMode: ViewMode;
}

export const useNotesContentAnimation = ({
  reduceMotion,
  selectedNoteId,
  viewMode,
}: UseNotesContentAnimationProps) => {
  const prefersReducedMotionRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    prefersReducedMotionRef.current =
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false) ||
      reduceMotion;
  }, [reduceMotion]);

  useGSAP(
    () => {
      const el = contentRef.current;
      if (!el) return;

      if (prefersReducedMotionRef.current) {
        gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
        return;
      }

      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    },
    { scope: contentRef, dependencies: [selectedNoteId, viewMode] },
  );

  return { contentRef };
};
