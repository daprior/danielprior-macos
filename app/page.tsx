"use client";

import { useState, useEffect } from "react";
import BootScreen from "@/components/boot-screen";
import LoginScreen from "@/components/login-screen";
import Desktop from "@/components/desktop";
import SleepScreen from "@/components/sleep-screen";
import ShutdownScreen from "@/components/shutdown-screen";
import { STORAGE_KEYS } from "@/constant/storage-keys";
import { ANIMATION_DELAYS_MS } from "@/constant/window-config";

type SystemState =
  | "booting"
  | "login"
  | "desktop"
  | "sleeping"
  | "shutdown"
  | "restarting";

export default function Home() {
  const [systemState, setSystemState] = useState<SystemState>("booting");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedDarkMode = window.localStorage.getItem(STORAGE_KEYS.isDarkMode);
    if (savedDarkMode === null) return false;
    return savedDarkMode === "true";
  });
  const [screenBrightness, setScreenBrightness] = useState(() => {
    if (typeof window === "undefined") return 90;
    const savedBrightness = window.localStorage.getItem(
      STORAGE_KEYS.screenBrightness,
    );
    if (savedBrightness === null) return 90;
    const parsed = Number.parseInt(savedBrightness, 10);
    return Number.isFinite(parsed) ? parsed : 90;
  });

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
  }, [systemState]);

  const handleLogin = () => {
    setSystemState("desktop");
  };

  const handleLogout = () => {
    setSystemState("login");
  };

  const handleSleep = () => {
    setSystemState("sleeping");
  };

  const handleWakeUp = () => {
    setSystemState("login");
  };

  const handleShutdown = () => {
    setSystemState("shutdown");
  };

  const handleBoot = () => {
    setSystemState("booting");
  };

  const handleRestart = () => {
    setSystemState("restarting");
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem(STORAGE_KEYS.isDarkMode, newMode.toString());
  };

  const updateBrightness = (value: number) => {
    setScreenBrightness(value);
    localStorage.setItem(STORAGE_KEYS.screenBrightness, value.toString());
  };

  // Render the appropriate screen based on system state
  const renderScreen = () => {
    switch (systemState) {
      case "booting":
      case "restarting":
        return <BootScreen />;

      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );

      case "desktop":
        return (
          <Desktop
            onLogout={handleLogout}
            onSleep={handleSleep}
            onShutdown={handleShutdown}
            onRestart={handleRestart}
            initialDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            initialBrightness={screenBrightness}
            onBrightnessChange={updateBrightness}
          />
        );

      case "shutdown":
        return <ShutdownScreen onBoot={handleBoot} />;

      case "sleeping":
        return <SleepScreen onWakeUp={handleWakeUp} />;

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
