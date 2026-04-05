"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  SPOTLIGHT_APPS,
  type AppRegistryItem,
} from "@/constants/apps-registry";
import {
  APP_WINDOW_DEFAULT_SIZE,
  APP_WINDOW_POSITION_RANGE,
} from "@/constants/window-config";
import { useDesktopStore } from "@/store/useDesktopStore";

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

export default function Spotlight() {
  const openApp = useDesktopStore((s) => s.openApp);
  const setSpotlightOpen = useDesktopStore((s) => s.setSpotlightOpen);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);

  const filteredApps = useMemo(() => {
    if (!searchTerm) return SPOTLIGHT_APPS;
    return SPOTLIGHT_APPS.filter((app) =>
      app.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  const handleAppClick = useCallback(
    (app: AppRegistryItem) => {
      const position = getWindowPosition(app.id);

      openApp({
        id: app.id,
        title: app.title,
        component: app.component,
        position,
        size: {
          width: APP_WINDOW_DEFAULT_SIZE.width,
          height: APP_WINDOW_DEFAULT_SIZE.height,
        },
      });
      setSpotlightOpen(false);
    },
    [openApp, setSpotlightOpen],
  );

  useEffect(() => {
    // Focus the input when spotlight opens
    inputRef.current?.focus();

    prefersReducedMotionRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    // Handle escape key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSpotlightOpen(false);
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
  }, [filteredApps, selectedIndex, handleAppClick, setSpotlightOpen]);

  useGSAP(
    () => {
      const overlayEl = overlayRef.current;
      const panelEl = panelRef.current;
      if (!overlayEl || !panelEl) return;

      gsap.set(overlayEl, { "--spotlight-blur": "0px" });

      if (prefersReducedMotionRef.current) {
        gsap.set(panelEl, { opacity: 1, scale: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        panelEl,
        { opacity: 0, scale: 0.95, y: -8, transformOrigin: "center center" },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.36,
          ease: "back.out(1.6)",
          clearProps: "opacity,transform",
        },
      );
    },
    { dependencies: [] },
  );

  useGSAP(
    () => {
      const overlayEl = overlayRef.current;
      if (!overlayEl) return;
      if (prefersReducedMotionRef.current) return;

      const blurPx = Math.min(12, Math.max(0, searchTerm.length * 0.8));
      gsap.to(overlayEl, {
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
        "--spotlight-blur": `${blurPx}px`,
      });
    },
    { dependencies: [searchTerm] },
  );

  useGSAP(
    () => {
      const resultsEl = resultsRef.current;
      if (!resultsEl) return;
      if (prefersReducedMotionRef.current) return;

      const items = resultsEl.querySelectorAll<HTMLElement>(
        "[data-spotlight-result]",
      );
      if (!items.length) return;

      gsap.killTweensOf(items);
      gsap.fromTo(
        items,
        { opacity: 0, y: -6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.14,
          ease: "power2.out",
          stagger: 0.035,
          clearProps: "opacity,transform",
        },
      );
    },
    { dependencies: [filteredApps] },
  );

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-transparent z-40 flex items-center justify-center"
      style={
        {
          backdropFilter: "blur(var(--spotlight-blur))",
          WebkitBackdropFilter: "blur(var(--spotlight-blur))",
          "--spotlight-blur": "0px",
        } as React.CSSProperties
      }
      onMouseDown={() => setSpotlightOpen(false)}
    >
      <div
        ref={panelRef}
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
          <div ref={resultsRef} className="max-h-80 overflow-y-auto">
            {filteredApps.map((app, index) => (
              <button
                key={app.id}
                type="button"
                data-spotlight-result
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
