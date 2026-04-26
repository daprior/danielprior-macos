"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import type { TerminalLine } from "@/types/apps/terminal";
import { getTypeDuration } from "../utils";

interface TerminalHistoryLineProps {
  line: TerminalLine;
  registerEl: (id: number, el: HTMLSpanElement | null) => void;
  prefersReducedMotion: boolean;
}

export const TerminalHistoryLine = memo(function TerminalHistoryLine({
  line,
  registerEl,
  prefersReducedMotion,
}: TerminalHistoryLineProps) {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  const setEl = useCallback(
    (el: HTMLSpanElement | null) => {
      spanRef.current = el;
      registerEl(line.id, el);
    },
    [line.id, registerEl],
  );

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    if (line.animation !== "typewriter") return;
    if (line.variant !== "matrix") return;

    if (prefersReducedMotion) {
      el.textContent = line.text;
      return;
    }

    gsap.killTweensOf(el);
    el.textContent = "";
    gsap.to(el, {
      duration: getTypeDuration(line.text, "matrix"),
      text: line.text,
      ease: "none",
      overwrite: "auto",
    });
  }, [line.animation, line.text, line.variant, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className="whitespace-pre-wrap">{line.text}</div>;
  }

  if (line.animation === "typewriter") {
    return (
      <div className="whitespace-pre-wrap">
        <span ref={setEl} />
      </div>
    );
  }

  return <div className="whitespace-pre-wrap">{line.text}</div>;
});
