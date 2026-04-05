"use client";

import { useState, useEffect, useRef } from "react";
import {
  Wifi,
  Bluetooth,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Maximize,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONTROL_CENTER_CONFIG } from "@/constants/ui-config";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
import { useTheme } from "next-themes";
export default function ControlCenter() {
  const { isDarkMode } = useIsDarkMode();
  const { setTheme } = useTheme();

  const wifiEnabled = useSettingsStore((s) => s.wifiEnabled);
  const toggleWifi = useSettingsStore((s) => s.toggleWifi);
  const bluetoothEnabled = useSettingsStore((s) => s.bluetoothEnabled);
  const toggleBluetooth = useSettingsStore((s) => s.toggleBluetooth);
  const brightness = useSettingsStore((s) => s.screenBrightness);
  const setBrightness = useSettingsStore((s) => s.setBrightness);
  const volume = useSettingsStore((s) => s.volume);
  const setVolume = useSettingsStore((s) => s.setVolume);

  const panelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);
  const [draggingSlider, setDraggingSlider] = useState<
    "brightness" | "volume" | null
  >(null);
  const pendingBrightnessRef = useRef<number | null>(null);
  const pendingVolumeRef = useRef<number | null>(null);
  const brightnessRafRef = useRef<number | null>(null);
  const volumeRafRef = useRef<number | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (typeof document === "undefined") return false;
    return !!document.fullscreenElement;
  });

  // Track fullscreen mode
  useEffect(() => {
    // Add fullscreen change event listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    prefersReducedMotionRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (!draggingSlider) return;

    const stopDragging = () => setDraggingSlider(null);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    window.addEventListener("blur", stopDragging);

    return () => {
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
      window.removeEventListener("blur", stopDragging);
    };
  }, [draggingSlider]);

  useEffect(() => {
    return () => {
      if (brightnessRafRef.current) {
        cancelAnimationFrame(brightnessRafRef.current);
      }
      if (volumeRafRef.current) {
        cancelAnimationFrame(volumeRafRef.current);
      }
    };
  }, []);

  useGSAP(
    () => {
      const panelEl = panelRef.current;
      const gridEl = gridRef.current;
      if (!panelEl || !gridEl) return;

      if (prefersReducedMotionRef.current) return;

      const tiles = gridEl.querySelectorAll<HTMLElement>("button");

      gsap.fromTo(
        panelEl,
        { opacity: 0, y: -8, scale: 0.98, transformOrigin: "top right" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.22,
          ease: "power2.out",
          clearProps: "opacity,transform",
        },
      );

      if (tiles.length) {
        gsap.fromTo(
          tiles,
          { opacity: 0, y: -6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.16,
            ease: "power2.out",
            stagger: 0.04,
            clearProps: "opacity,transform",
          },
        );
      }
    },
    { dependencies: [] },
  );

  const scheduleBrightnessUpdate = (value: number) => {
    pendingBrightnessRef.current = value;
    if (brightnessRafRef.current) return;
    brightnessRafRef.current = requestAnimationFrame(() => {
      brightnessRafRef.current = null;
      if (pendingBrightnessRef.current === null) return;
      setBrightness(pendingBrightnessRef.current);
    });
  };

  const scheduleVolumeUpdate = (value: number) => {
    pendingVolumeRef.current = value;
    if (volumeRafRef.current) return;
    volumeRafRef.current = requestAnimationFrame(() => {
      volumeRafRef.current = null;
      if (pendingVolumeRef.current === null) return;
      setVolume(pendingVolumeRef.current);
    });
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      ref={panelRef}
      className="fixed top-8 right-4 w-80 bg-gray-800/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl z-40"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="p-4">
        <div ref={gridRef} className="grid grid-cols-4 gap-3 mb-4">
          <button
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              wifiEnabled ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={toggleWifi}
          >
            <Wifi className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs">Wi-Fi</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              bluetoothEnabled ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={toggleBluetooth}
          >
            <Bluetooth className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs">Bluetooth</span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              isDarkMode ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          >
            {isDarkMode ? (
              <Moon className="w-6 h-6 text-white mb-1" />
            ) : (
              <Sun className="w-6 h-6 text-white mb-1" />
            )}
            <span className="text-white text-xs">
              {isDarkMode ? "Dark" : "Light"}
            </span>
          </button>

          <button
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${
              isFullscreen ? "bg-blue-500" : "bg-gray-700"
            }`}
            onClick={toggleFullscreen}
          >
            <Maximize className="w-6 h-6 text-white mb-1" />
            <span className="text-white text-xs">
              {isFullscreen ? "Exit" : "Fullscreen"}
            </span>
          </button>
        </div>

        <div
          className={`bg-gray-700 rounded-xl p-3 mb-3 transition-all duration-150 ${
            draggingSlider === "brightness" ? "ring-2 ring-white/25" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Display</span>
            <span className="text-white text-sm">{brightness}%</span>
          </div>
          <input
            type="range"
            min={CONTROL_CENTER_CONFIG.brightnessMin}
            max={CONTROL_CENTER_CONFIG.brightnessMax}
            value={brightness}
            onPointerDown={() => setDraggingSlider("brightness")}
            onChange={(e) => scheduleBrightnessUpdate(Number(e.target.value))}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          />
        </div>

        <div
          className={`bg-gray-700 rounded-xl p-3 transition-all duration-150 ${
            draggingSlider === "volume" ? "ring-2 ring-white/25" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Volume</span>
            <span className="text-white text-sm">{volume}%</span>
          </div>
          <div className="flex items-center">
            {volume === 0 ? (
              <VolumeX className="w-5 h-5 text-white mr-2" />
            ) : (
              <Volume2 className="w-5 h-5 text-white mr-2" />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onPointerDown={() => setDraggingSlider("volume")}
              onChange={(e) => scheduleVolumeUpdate(Number(e.target.value))}
              className="flex-1 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
