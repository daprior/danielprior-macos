"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { AppWindow } from "@/types";
import { LAUNCHPAD_APPS, type AppRegistryItem } from "@/constant/apps-registry";
import {
  ANIMATION_DELAYS_MS,
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

interface LaunchpadProps {
  onAppClick: (app: AppWindow) => void;
  onClose: () => void;
}

// Improve Launchpad appearance
export default function Launchpad({ onAppClick, onClose }: LaunchpadProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const filteredApps = useMemo(() => {
    if (!searchTerm) return LAUNCHPAD_APPS;
    return LAUNCHPAD_APPS.filter((app) =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const handleAppClick = (app: AppRegistryItem) => {
    const position = getWindowPosition(app.id);

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
    onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, ANIMATION_DELAYS_MS.launchpadClose);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-md z-40 flex flex-col items-center justify-center
        transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onMouseDown={handleClose}
    >
      <div
        className={`w-full max-w-4xl px-8 py-12 transition-transform duration-300 
          ${isVisible ? "translate-y-0" : "translate-y-10"}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative w-64 mx-auto mb-12">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/20 backdrop-blur-md text-white border-0 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-8">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              className="flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => handleAppClick(app)}
              type="button"
            >
              <div className="w-16 h-16 flex items-center justify-center mb-2 rounded-xl group-hover:bg-white/20 transition-colors">
                <Image
                  src={app.icon || "/placeholder.svg"}
                  alt={app.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="text-white text-sm text-center">
                {app.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
