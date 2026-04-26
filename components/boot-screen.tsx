"use client";

import { useCallback, useEffect, useRef } from "react";
import { AppleIcon } from "@/components/icons";
import { ANIMATION_DELAYS_MS } from "@/constants/window-config";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSystemStore } from "@/store/useSystemStore";

export default function BootScreen() {
  // System state
  const systemState = useSystemStore((state) => state.systemState);
  const setSystemState = useSystemStore((state) => state.setSystemState);

  // Settings state
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  const hasCompletedRef = useRef(false);

  const finishBoot = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    if (systemState === "booting" || systemState === "restarting") {
      setSystemState("login");
    }
  }, [setSystemState, systemState]);

  useEffect(() => {
    if (systemState !== "booting" && systemState !== "restarting") return;

    hasCompletedRef.current = false;

    const reduced =
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false) ||
      reduceMotion;

    const totalMs = reduced ? 0 : ANIMATION_DELAYS_MS.bootSequence + 220;
    const timer = window.setTimeout(() => {
      finishBoot();
    }, totalMs);

    return () => window.clearTimeout(timer);
  }, [finishBoot, reduceMotion, systemState]);

  return (
    <div
      className="h-screen w-screen bg-black flex flex-col items-center justify-center opacity-0 boot-fade motion-reduce:opacity-100"
      style={{
        ["--boot-fade-duration" as never]: `${ANIMATION_DELAYS_MS.bootSequence + 220}ms`,
      }}
    >
      <AppleIcon className="w-20 h-20 text-white mb-8" />
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full w-0 boot-fill motion-reduce:w-full"
          style={{
            ["--boot-fill-duration" as never]: `${ANIMATION_DELAYS_MS.bootSequence}ms`,
          }}
        />
      </div>
    </div>
  );
}
