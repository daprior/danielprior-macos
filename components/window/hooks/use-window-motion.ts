"use client";

import { useEffect, useRef } from "react";

export const useWindowMotionPreference = (reduceMotion: boolean) => {
  const prefersReducedMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    prefersReducedMotionRef.current =
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false) ||
      reduceMotion;
  }, [reduceMotion]);

  return prefersReducedMotionRef;
};
