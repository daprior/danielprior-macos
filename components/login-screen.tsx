"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUISound } from "@/hooks/useUISounds";
import { useSystemStore } from "@/store/useSystemStore";
import { useTheme } from "next-themes";
import { useSettingsStore } from "@/store/useSettingsStore";
import { WALLPAPERS } from "@/constants/appearance-config";

export default function LoginScreen() {
  // System state
  const login = useSystemStore((state) => state.login);

  // Settings state
  const wallpaperId = useSettingsStore((state) => state.wallpaperId);

  const { playStartup, playLogin } = useUISound();
  const { resolvedTheme, setTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);
  const isDarkMode = hasMounted && resolvedTheme === "dark";

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [time, setTime] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHasMounted(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    playStartup();
  }, [playStartup]);

  // Set the time once on mount. Avoid a ticking clock before interaction,
  // otherwise LCP can keep moving forward due to repeated repaints.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setTime(new Date());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  // Start ticking only after the user unlocks.
  useEffect(() => {
    if (!isUnlocked) return;
    const timeoutId = window.setTimeout(() => {
      setTime(new Date());
    }, 0);

    const intervalId = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [isUnlocked]);

  useEffect(() => {
    if (!isUnlocked) return;
    window.requestAnimationFrame(() => {
      passwordInputRef.current?.focus();
    });
  }, [isUnlocked]);

  const unlock = useCallback(() => {
    if (isUnlocked) return;
    setIsUnlocked(true);
  }, [isUnlocked]);

  useEffect(() => {
    if (isUnlocked) return;

    const onKeyDown = () => unlock();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isUnlocked, unlock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUnlocked) {
      unlock();
      return;
    }

    if (isSubmitting) return;

    playLogin();
    setIsSubmitting(true);
    window.setTimeout(() => {
      login();
    }, 220);
  };

  const formattedTime = time
    ? time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "--:--";

  const formattedDate = time
    ? time.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  const selectedWallpaper =
    WALLPAPERS.find((w) => w.id === wallpaperId) ??
    WALLPAPERS.find((w) => w.id === "default") ??
    WALLPAPERS[0];

  // Choose wallpaper based on dark/light mode
  const wallpaper = isDarkMode
    ? selectedWallpaper?.darkSrc
    : selectedWallpaper?.lightSrc;

  return (
    <div
      className={`h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center transition-opacity duration-200 ease-in-out motion-reduce:transition-none ${
        isSubmitting ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundImage: `url('${wallpaper}')` }}
      onMouseDown={() => {
        if (!isUnlocked) unlock();
      }}
    >
      <div
        className={`flex flex-col items-center mb-8 transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
          isUnlocked ? "opacity-85 -translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="text-white text-5xl font-light mb-2">
          {formattedTime}
        </div>
        <div className="text-white text-xl font-light">{formattedDate}</div>
      </div>

      <div
        className={`flex flex-col items-center transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
          isUnlocked
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center mb-4">
          <Image
            src="https://res.cloudinary.com/djy5oyivn/image/upload/q_auto/f_auto/v1775836236/letter-m_lou3dp.png"
            alt="User avatar"
            width={96}
            height={96}
            unoptimized
            className="object-cover w-full h-full"
          />
        </div>
        <h2 className="text-white text-2xl font-medium mb-6">Maen</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <Input
            ref={passwordInputRef}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            disabled={isSubmitting || !isUnlocked}
            className="w-64 bg-white/20 backdrop-blur-md border-0 text-white placeholder:text-white/70 mb-2"
          />
          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting || !isUnlocked}
            className="mt-2 bg-white/20 backdrop-blur-md border-0 text-white hover:bg-white/30"
          >
            Login
          </Button>
        </form>
      </div>

      <div className="fixed bottom-8">
        <button
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
