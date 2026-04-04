"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import type { AppWindow } from "@/types";
import { DOCK_APPS, type AppRegistryItem } from "@/constant/apps-registry";
import { UI_MOBILE_BREAKPOINT } from "@/constant/ui-config";
import {
  APP_WINDOW_DEFAULT_SIZE,
  APP_WINDOW_POSITION_RANGE,
} from "@/constant/window-config";

const hashString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const getWindowPosition = (seed: string) => {
  const xRange =
    APP_WINDOW_POSITION_RANGE.xMax - APP_WINDOW_POSITION_RANGE.xMin;
  const yRange =
    APP_WINDOW_POSITION_RANGE.yMax - APP_WINDOW_POSITION_RANGE.yMin;

  const xUnit = (hashString(`${seed}:x`) % 1000) / 1000;
  const yUnit = (hashString(`${seed}:y`) % 1000) / 1000;

  return {
    x: APP_WINDOW_POSITION_RANGE.xMin + xUnit * xRange,
    y: APP_WINDOW_POSITION_RANGE.yMin + yUnit * yRange,
  };
};

interface DockProps {
  onAppClick: (app: AppWindow) => void;
  onLaunchpadClick: () => void;
  activeAppIds: string[];
  isDarkMode: boolean;
}

export default function Dock({
  onAppClick,
  onLaunchpadClick,
  activeAppIds,
  isDarkMode,
}: DockProps) {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [dockWidth, setDockWidth] = useState(0);
  const dockRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < UI_MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!showMobileMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu]);

  const handleAppClick = (app: AppRegistryItem) => {
    if (app.id === "launchpad") {
      onLaunchpadClick();
      return;
    }

    const position = getWindowPosition(`${app.id}:${activeAppIds.length}`);

    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position,
      size: {
        width: APP_WINDOW_DEFAULT_SIZE.width,
        height: APP_WINDOW_DEFAULT_SIZE.height,
      },
    });

    // Close mobile menu after clicking an app
    if (showMobileMenu) {
      setShowMobileMenu(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dockRef.current && !isMobile) {
      const rect = dockRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setMouseX(x);
      setDockWidth(rect.width);
    }
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  // Calculate scale for each icon based on distance from mouse
  const getIconScale = (index: number, iconCount: number) => {
    if (mouseX === null || isMobile || dockWidth <= 0) return 1;

    // Get the dock width and calculate the position of each icon
    const iconWidth = dockWidth / iconCount;
    const iconPosition = iconWidth * (index + 0.5); // Center of the icon

    // Distance from mouse to icon center
    const distance = Math.abs(mouseX - iconPosition);

    // Maximum scale and distance influence
    const maxScale = 2;
    const maxDistance = iconWidth * 2.5;

    // Calculate scale based on distance (closer = larger)
    if (distance > maxDistance) return 1;

    // Smooth parabolic scaling function
    const scale = 1 + (maxScale - 1) * Math.pow(1 - distance / maxDistance, 2);

    return scale;
  };

  // For mobile, we'll show only the first 4 apps plus a "more" button
  const visibleApps = isMobile ? DOCK_APPS.slice(0, 4) : DOCK_APPS;
  const hiddenApps = isMobile ? DOCK_APPS.slice(4) : [];

  return (
    <div
      ref={dockRef}
      className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50"
    >
      {/* Mobile expanded menu */}
      {isMobile && showMobileMenu && (
        <div
          className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 w-[280px] 
          ${isDarkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-xl 
          rounded-xl border border-white/20 shadow-lg p-4 mb-2`}
        >
          <div className="grid grid-cols-4 gap-4">
            {hiddenApps.map((app) => (
              <button
                key={app.id}
                className="flex flex-col items-center justify-center"
                onClick={() => handleAppClick(app)}
                type="button"
              >
                <div className="w-14 h-14 flex items-center justify-center">
                  <Image
                    src={app.icon || "/placeholder.svg"}
                    alt={app.title}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                    draggable={false}
                  />
                </div>
                <span
                  className={`text-xs mt-1 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  {app.title}
                </span>
                {activeAppIds.includes(app.id) && (
                  <div className="w-1 h-1 bg-white rounded-full mt-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main dock */}
      <div
        className={`px-3 py-2 rounded-2xl 
          ${isDarkMode ? "bg-white/10" : "bg-white/60"} backdrop-blur-xl 
          flex items-end border border-white/20 shadow-lg
          ${isMobile ? "h-20" : "h-16"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {visibleApps.map((app, index) => {
          const scale = getIconScale(index, visibleApps.length);

          return (
            <button
              key={app.id}
              className={`flex flex-col items-center justify-end h-full ${isMobile ? "px-3" : "px-2"}`}
              style={{
                transform: isMobile
                  ? "none"
                  : `translateY(${(scale - 1) * -8}px)`,
                zIndex: scale > 1 ? 10 : 1,
                transition:
                  mouseX === null ? "transform 0.2s ease-out" : "none",
              }}
              onClick={() => handleAppClick(app)}
              type="button"
            >
              <div
                className="relative cursor-pointer"
                style={{
                  transform: isMobile ? "none" : `scale(${scale})`,
                  transformOrigin: "bottom center",
                  transition:
                    mouseX === null ? "transform 0.2s ease-out" : "none",
                }}
              >
                <Image
                  src={app.icon || "/placeholder.svg"}
                  alt={app.title}
                  width={56}
                  height={56}
                  className={`object-contain ${isMobile ? "w-14 h-14" : "w-12 h-12"}`}
                  draggable={false}
                />

                {/* Tooltip - only on desktop */}
                {!isMobile && scale > 1.5 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/70 text-white text-xs rounded whitespace-nowrap">
                    {app.title}
                  </div>
                )}

                {/* Indicator dot for active apps */}
                {activeAppIds.includes(app.id) && (
                  <div className="absolute bottom-[-5px] left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </div>
            </button>
          );
        })}

        {/* More button for mobile */}
        {isMobile && (
          <button
            className="flex flex-col items-center justify-end h-full px-3"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            type="button"
          >
            <div className="relative cursor-pointer">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center 
                ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} 
                ${showMobileMenu ? (isDarkMode ? "bg-blue-700" : "bg-blue-200") : ""}`}
              >
                <MoreHorizontal
                  className={`w-8 h-8 ${isDarkMode ? "text-white" : "text-gray-800"}`}
                />
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
