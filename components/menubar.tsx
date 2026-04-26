"use client";

import type React from "react";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { AppleIcon } from "@/components/icons";
import gsap from "gsap";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSystemStore } from "@/store/useSystemStore";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
import { useUISound } from "@/hooks/useUISounds";
import { useIsMobile } from "@/hooks/use-mobile";

type BatteryManager = {
  level: number;
  charging: boolean;
  addEventListener: (
    type: "levelchange" | "chargingchange",
    listener: () => void,
  ) => void;
  removeEventListener: (
    type: "levelchange" | "chargingchange",
    listener: () => void,
  ) => void;
};

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<BatteryManager>;
};

interface MenubarProps {
  time: Date;
}

export default function Menubar({ time }: MenubarProps) {
  const { isDarkMode } = useIsDarkMode();
  const { playSwitchOn, playSwitchOff, playPop } = useUISound();
  const isMobile = useIsMobile();

  const prefersReducedMotionRef = useRef(false);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [showWifiToggle, setShowWifiToggle] = useState(false);

  // Settings state
  const wifiEnabled = useSettingsStore((state) => state.wifiEnabled);
  const toggleWifi = useSettingsStore((state) => state.toggleWifi);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  // Desktop state
  const toggleSpotlight = useDesktopStore((state) => state.toggleSpotlight);
  const toggleControlCenter = useDesktopStore(
    (state) => state.toggleControlCenter,
  );
  const showControlCenter = useDesktopStore((state) => state.showControlCenter);
  const requestCloseWindow = useDesktopStore(
    (state) => state.requestCloseWindow,
  );
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const openWindows = useDesktopStore((state) => state.openWindows);

  // System state
  const sleep = useSystemStore((state) => state.sleep);
  const restart = useSystemStore((state) => state.restart);
  const shutdown = useSystemStore((state) => state.shutdown);
  const logout = useSystemStore((state) => state.logout);

  const activeWindow = useMemo(() => {
    if (!activeWindowId) return null;
    const found = openWindows.find((w) => w.id === activeWindowId);
    return found ? { id: found.id, title: found.title } : null;
  }, [activeWindowId, openWindows]);
  const menuRef = useRef<HTMLDivElement>(null);
  const wifiRef = useRef<HTMLDivElement>(null);

  const formattedTime = isMobile
    ? time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : time.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

  const updateBatteryStatus = (battery: BatteryManager) => {
    setBatteryLevel(Math.round(battery.level * 100));
    setIsCharging(battery.charging);
  };

  useEffect(() => {
    prefersReducedMotionRef.current =
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false) ||
      reduceMotion;

    // Try to get battery information if available
    const nav = navigator as NavigatorWithBattery;

    let batteryManager: BatteryManager | null = null;
    let onLevelChange: (() => void) | null = null;
    let onChargingChange: (() => void) | null = null;

    if (nav.getBattery) {
      nav
        .getBattery()
        .then((battery) => {
          batteryManager = battery;

          updateBatteryStatus(battery);

          onLevelChange = () => updateBatteryStatus(battery);
          onChargingChange = () => updateBatteryStatus(battery);

          battery.addEventListener("levelchange", onLevelChange);
          battery.addEventListener("chargingchange", onChargingChange);
        })
        .catch(() => {
          // If there's an error, default to 100%
          setBatteryLevel(100);
          setIsCharging(false);
        });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }

      if (
        wifiRef.current &&
        !wifiRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".wifi-icon")
      ) {
        setShowWifiToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      if (batteryManager && onLevelChange && onChargingChange) {
        batteryManager.removeEventListener("levelchange", onLevelChange);
        batteryManager.removeEventListener("chargingchange", onChargingChange);
      }
    };
  }, [reduceMotion]);

  const runDesktopExitTransition = (next: () => void) => {
    setActiveMenu(null);
    playPop();

    if (prefersReducedMotionRef.current) {
      next();
      return;
    }

    const desktopEl = document.querySelector<HTMLElement>(
      '[data-screen="desktop"]',
    );
    if (!desktopEl) {
      next();
      return;
    }

    gsap.killTweensOf(desktopEl);
    gsap.to(desktopEl, {
      opacity: 0,
      duration: 0.18,
      ease: "power2.inOut",
      onComplete: next,
    });
  };

  const toggleMenu = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  const handleAppleMenuToggle = () => {
    playPop();
    toggleMenu("apple");
  };

  const toggleWifiPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPop();
    setShowWifiToggle(!showWifiToggle);
  };

  const handleWifiToggle = () => {
    const nextWifiEnabled = !wifiEnabled;
    if (nextWifiEnabled) {
      playSwitchOn();
    } else {
      playSwitchOff();
    }
    toggleWifi();
  };

  const handleControlCenterToggle = () => {
    if (!showControlCenter) {
      playPop();
    }
    toggleControlCenter();
  };

  const menuBgClass = isDarkMode ? "bg-black/40" : "bg-white/20";
  const dropdownBgClass = isDarkMode
    ? "bg-gray-800/90 backdrop-blur-md"
    : "bg-gray-200/90 backdrop-blur-md";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";
  const hoverClass = isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400";

  return (
    <div
      ref={menuRef}
      data-role="menubar"
      className={`fixed top-0 left-0 right-0 ${menuBgClass} z-50 flex items-center overflow-hidden px-4 ${textClass} text-sm`}
      style={
        {
          backdropFilter: "blur(var(--menubar-blur))",
          WebkitBackdropFilter: "blur(var(--menubar-blur))",
          "--menubar-blur": "20px",
          paddingTop: "env(safe-area-inset-top)",
          height: "calc(24px + env(safe-area-inset-top))",
        } as React.CSSProperties
      }
    >
      <div className="flex-1 flex items-center" data-menubar-left>
        <button
          data-menubar-left-item
          className="flex items-center mr-4 hover:bg-white/10 px-2 py-0.5 rounded"
          onClick={handleAppleMenuToggle}
          type="button"
        >
          <AppleIcon className="w-4 h-4" />
        </button>

        {activeMenu === "apple" && (
          <div
            className={`absolute top-full left-2 ${dropdownBgClass} rounded-lg shadow-xl ${textClass} py-1 w-56`}
          >
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`}>
              About This Mac
            </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`}>
              System Settings...
            </button>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`}>
              App Store...
            </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button
              className={`w-full text-left px-4 py-1 ${hoverClass}`}
              onClick={() => runDesktopExitTransition(sleep)}
            >
              Sleep
            </button>
            <button
              className={`w-full text-left px-4 py-1 ${hoverClass}`}
              onClick={() => runDesktopExitTransition(restart)}
            >
              Restart...
            </button>
            <button
              className={`w-full text-left px-4 py-1 ${hoverClass}`}
              onClick={() => runDesktopExitTransition(shutdown)}
            >
              Shut Down...
            </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button
              className={`w-full text-left px-4 py-1 ${hoverClass}`}
              onClick={() => runDesktopExitTransition(logout)}
            >
              Log Out Maen...
            </button>
          </div>
        )}

        {activeWindow && (
          <div className="flex items-center mr-4" data-menubar-left-item>
            <button
              className={`font-medium hover:bg-white/10 px-2 py-0.5 rounded ${activeMenu === "app" ? "bg-white/10" : ""}`}
              onClick={() => toggleMenu("app")}
              type="button"
            >
              {activeWindow.title}
            </button>

            <button
              className="ml-1 hover:bg-white/10 px-1.5 py-0.5 rounded"
              type="button"
              aria-label="Close window"
              onClick={(e) => {
                e.stopPropagation();
                if (!activeWindowId) return;
                requestCloseWindow(activeWindowId);
                setActiveMenu(null);
              }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex min-w-0 items-center space-x-3" data-menubar-right>
        <span className="mr-1" data-menubar-right-item>
          {batteryLevel}%
        </span>

        <div className="relative" data-menubar-right-item>
          <div className="w-6 h-3 border border-current rounded-sm relative">
            <div
              className="absolute top-0 left-0 bottom-0 bg-current"
              style={{ width: `${batteryLevel}%` }}
            ></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-current rounded-r-sm"></div>
            {isCharging && (
              <div className="absolute inset-0 flex items-center justify-center text-xs">
                ⚡
              </div>
            )}
          </div>
        </div>

        <div className="relative" data-menubar-right-item>
          <button className="wifi-icon" onClick={toggleWifiPopup}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              {wifiEnabled ? (
                <>
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" />
                </>
              ) : (
                <>
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                  <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" />
                </>
              )}
            </svg>
          </button>

          {showWifiToggle && (
            <div
              ref={wifiRef}
              className={`absolute top-full right-0 ${dropdownBgClass} rounded-lg shadow-xl ${textClass} py-3 px-4 w-64`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Wi-Fi</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wifiEnabled}
                    onChange={handleWifiToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          )}
        </div>

        <button onClick={toggleSpotlight} data-menubar-right-item type="button">
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={handleControlCenterToggle}
          className="flex items-center justify-center"
          data-menubar-right-item
          type="button"
        >
          <Image
            src="/control-center-icon.webp"
            alt="Control Center"
            width={16}
            height={16}
            className="w-4 h-4"
            quality={85}
            loading="eager"
            style={{
              filter: isDarkMode ? "invert(1)" : "none",
              opacity: 0.9,
            }}
          />
        </button>

        <span
          data-menubar-right-item
          className={
            isMobile
              ? "max-w-[6.75rem] truncate whitespace-nowrap text-xs"
              : "whitespace-nowrap"
          }
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
