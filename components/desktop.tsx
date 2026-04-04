"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Dock from "@/components/dock";
import Menubar from "@/components/menubar";
import Wallpaper from "@/components/wallpaper";
import Window from "@/components/window";
import Launchpad from "@/components/launchpad";
import ControlCenter from "@/components/control-center";
import Spotlight from "@/components/spotlight";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function Desktop() {
  const [time, setTime] = useState(new Date());
  const openWindows = useDesktopStore((s) => s.openWindows);
  const activeWindowId = useDesktopStore((s) => s.activeWindowId);
  const showLaunchpad = useDesktopStore((s) => s.showLaunchpad);
  const showControlCenter = useDesktopStore((s) => s.showControlCenter);
  const showSpotlight = useDesktopStore((s) => s.showSpotlight);
  const desktopBackgroundClick = useDesktopStore(
    (s) => s.desktopBackgroundClick,
  );

  const screenBrightness = useSettingsStore((s) => s.screenBrightness);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // No default app opening to avoid duplicate key issues

    return () => clearInterval(timer);
  }, []);

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Only handle clicks directly on the desktop, not on children
    if (e.target === desktopRef.current) {
      desktopBackgroundClick();
    }
  };

  return (
    <div className="relative">
      <div
        ref={desktopRef}
        className="relative h-screen w-screen overflow-hidden"
        onMouseDown={handleDesktopClick}
      >
        <Wallpaper />

        <Menubar time={time} />

        {/* Windows */}
        <div className="absolute inset-0 pt-6 pb-16">
          {openWindows.map((window) => (
            <Window
              key={window.id}
              window={window}
              isActive={activeWindowId === window.id}
              windowId={window.id}
            />
          ))}
        </div>

        {/* Launchpad */}
        {showLaunchpad && <Launchpad />}

        {/* Control Center */}
        {showControlCenter && <ControlCenter />}

        {/* Spotlight */}
        {showSpotlight && <Spotlight />}

        <Dock />
      </div>

      {/* Brightness overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  );
}
