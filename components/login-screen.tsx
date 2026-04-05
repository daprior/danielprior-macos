"use client";

import type React from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSystemStore } from "@/store/useSystemStore";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LoginScreen() {
  const login = useSystemStore((s) => s.login);
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const rootRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotionRef = useRef(false);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    prefersReducedMotionRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useGSAP(
    () => {
      const rootEl = rootRef.current;
      if (!rootEl) return;

      if (prefersReducedMotionRef.current) return;

      gsap.set(rootEl, { opacity: 0 });
      gsap.to(rootEl, {
        opacity: 1,
        duration: 0.22,
        ease: "power2.out",
        clearProps: "opacity",
      });
    },
    { dependencies: [] },
  );

  useGSAP(
    () => {
      const lockEl = lockRef.current;
      const authEl = authRef.current;
      if (!lockEl || !authEl) return;

      if (!isUnlocked) {
        gsap.set(authEl, { opacity: 0, y: 10, pointerEvents: "none" });
        gsap.set(lockEl, { opacity: 1, y: 0 });
        return;
      }

      if (prefersReducedMotionRef.current) {
        gsap.set(authEl, { opacity: 1, y: 0, pointerEvents: "auto" });
        passwordInputRef.current?.focus();
        return;
      }

      gsap.set(authEl, { pointerEvents: "auto" });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      timeline.to(lockEl, { opacity: 0.85, y: -10, duration: 0.22 }, 0);
      timeline.fromTo(
        authEl,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.22,
          clearProps: "opacity,transform",
          onComplete: () => passwordInputRef.current?.focus(),
        },
        0.04,
      );

      return () => {
        timeline.kill();
      };
    },
    { dependencies: [isUnlocked] },
  );

  const unlock = useCallback(() => {
    if (isUnlocked) return;
    setIsUnlocked(true);

    if (prefersReducedMotionRef.current) {
      passwordInputRef.current?.focus();
    }
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

    if (password.length > 0) {
      if (prefersReducedMotionRef.current) {
        login();
        return;
      }

      const rootEl = rootRef.current;
      if (!rootEl) {
        login();
        return;
      }

      setIsSubmitting(true);
      gsap.to(rootEl, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.inOut",
        onComplete: login,
      });
    } else {
      setError(true);
    }
  };

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Choose wallpaper based on dark/light mode
  const wallpaper = isDarkMode ? "/wallpaper-night.jpg" : "/wallpaper-day.jpg";

  return (
    <div
      ref={rootRef}
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url('${wallpaper}')` }}
      onMouseDown={() => {
        if (!isUnlocked) unlock();
      }}
    >
      <div ref={lockRef} className="flex flex-col items-center mb-8">
        <div className="text-white text-5xl font-light mb-2">
          {formattedTime}
        </div>
        <div className="text-white text-xl font-light">{formattedDate}</div>
      </div>

      <div ref={authRef} className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <span className="text-white text-5xl font-bold">D</span>
        </div>
        {/* <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center mb-4">
          <Image
            src="/letter-d.png"
            alt="User avatar"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div> */}
        <h2 className="text-white text-2xl font-medium mb-6">Daniel</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <Input
            ref={passwordInputRef}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            disabled={isSubmitting || !isUnlocked}
            className={`w-64 bg-white/20 backdrop-blur-md border-0 text-white placeholder:text-white/70 mb-2 ${
              error ? "ring-2 ring-red-500" : ""
            }`}
          />

          {error && isUnlocked && (
            <p className="text-red-500 text-sm mb-2">Please enter a password</p>
          )}
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
