"use client";

import BootScreen from "@/components/boot-screen";
import LoginScreen from "@/components/login-screen";
import Desktop from "@/components/desktop";
import SleepScreen from "@/components/sleep-screen";
import ShutdownScreen from "@/components/shutdown-screen";
import { useSystemStore } from "@/store/useSystemStore";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function Home() {
  const systemState = useSystemStore((s) => s.systemState);
  const screenBrightness = useSettingsStore((s) => s.screenBrightness);

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
