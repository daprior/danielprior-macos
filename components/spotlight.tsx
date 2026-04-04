"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import type { AppWindow } from "@/types";
import { SPOTLIGHT_APPS, type AppRegistryItem } from "@/constant/apps-registry";
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

interface SpotlightProps {
  onClose: () => void;
  onAppClick: (app: AppWindow) => void;
}

export default function Spotlight({ onClose, onAppClick }: SpotlightProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredApps = useMemo(() => {
    if (!searchTerm) return SPOTLIGHT_APPS;
    return SPOTLIGHT_APPS.filter((app) =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const handleAppClick = useCallback(
    (app: AppRegistryItem) => {
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
    },
    [onAppClick, onClose],
  );

  useEffect(() => {
    // Focus the input when spotlight opens
    inputRef.current?.focus();

    // Handle escape key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          prev < filteredApps.length - 1 ? prev + 1 : prev,
        );
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        e.preventDefault();
      } else if (e.key === "Enter" && filteredApps.length > 0) {
        handleAppClick(filteredApps[selectedIndex]);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredApps, selectedIndex, handleAppClick, onClose]);

  return (
    <div
      className="fixed inset-0 bg-transparent z-40 flex items-center justify-center"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
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
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-white border-0 py-4 pl-12 pr-4 focus:outline-none text-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(0);
            }}
          />
        </div>

        {filteredApps.length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            {filteredApps.map((app, index) => (
              <button
                key={app.id}
                type="button"
                className={`flex items-center px-4 py-3 cursor-pointer ${
                  index === selectedIndex ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
                onClick={() => handleAppClick(app)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <Image
                    src={app.icon || "/placeholder.svg"}
                    alt={app.title}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-white">{app.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
