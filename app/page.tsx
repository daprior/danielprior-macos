"use client";

import { useEffect } from "react";
import BootScreen from "@/components/boot-screen";
import LoginScreen from "@/components/login-screen";
import Desktop from "@/components/desktop";
import SleepScreen from "@/components/sleep-screen";
import ShutdownScreen from "@/components/shutdown-screen";
import { ANIMATION_DELAYS_MS } from "@/constants/window-config";
import { useSystemStore } from "@/store/useSystemStore";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function Home() {
  const systemState = useSystemStore((s) => s.systemState);
  const setSystemState = useSystemStore((s) => s.setSystemState);
  const screenBrightness = useSettingsStore((s) => s.screenBrightness);

  // Simulate boot sequence
  useEffect(() => {
    if (systemState === "booting") {
      const timer = setTimeout(() => {
        setSystemState("login");
      }, ANIMATION_DELAYS_MS.bootSequence);

      return () => clearTimeout(timer);
    }

    if (systemState === "restarting") {
      // First show boot screen
      const bootTimer = setTimeout(() => {
        setSystemState("login");
      }, ANIMATION_DELAYS_MS.bootSequence);

      return () => clearTimeout(bootTimer);
    }
  }, [systemState, setSystemState]);

  // Render the appropriate screen based on system state
  const renderScreen = () => {
    switch (systemState) {
      case "booting":
      case "restarting":
        return <BootScreen />;

      case "login":
        return <LoginScreen />;

      case "desktop":
        return <Desktop />;

      case "shutdown":
        return <ShutdownScreen />;

      case "sleeping":
        return <SleepScreen />;

      default:
        return <BootScreen />;
    }
  };

  return (
    <div className="relative">
      {renderScreen()}

      {/* Brightness overlay - apply to all screens */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  );
}
