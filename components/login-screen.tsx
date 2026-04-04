"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSystemStore } from "@/store/useSystemStore";
import { useTheme } from "next-themes";

export default function LoginScreen() {
  const login = useSystemStore((s) => s.login);
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length >= 0) {
      login();
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
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url('${wallpaper}')` }}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="text-white text-5xl font-light mb-2">
          {formattedTime}
        </div>
        <div className="text-white text-xl font-light">{formattedDate}</div>
      </div>

      <div className="flex flex-col items-center">
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
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`w-64 bg-white/20 backdrop-blur-md border-0 text-white placeholder:text-white/70 mb-2 ${
              error ? "ring-2 ring-red-500" : ""
            }`}
          />

          {error && (
            <p className="text-red-500 text-sm mb-2">Please enter a password</p>
          )}
          <Button
            type="submit"
            variant="outline"
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
