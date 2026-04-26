"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useTheme } from "next-themes";

const Analytics = dynamic(
  () => import("@vercel/analytics/react").then((mod) => mod.Analytics),
  { ssr: false },
);

function DeferredAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Load analytics after the main content becomes interactive.
    const ric = (globalThis as unknown as { requestIdleCallback?: unknown })
      .requestIdleCallback;

    if (typeof ric === "function") {
      const id = (
        ric as (cb: () => void, opts?: { timeout: number }) => number
      )(() => setEnabled(true), { timeout: 2500 });

      const cancel = (globalThis as unknown as { cancelIdleCallback?: unknown })
        .cancelIdleCallback;
      return () => {
        if (typeof cancel === "function") {
          (cancel as (id: number) => void)(id);
        }
      };
    }

    const id = setTimeout(() => setEnabled(true), 1500);
    return () => clearTimeout(id);
  }, []);

  return enabled ? <Analytics /> : null;
}

function ThemeStorageMigration() {
  const { setTheme } = useTheme();

  useEffect(() => {
    try {
      const nextThemesKey = "theme";
      const existing = window.localStorage.getItem(nextThemesKey);
      if (existing) return;

      const legacy = window.localStorage.getItem(STORAGE_KEYS.isDarkMode);
      if (legacy === null) return;

      setTheme(legacy === "true" ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [setTheme]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeStorageMigration />
      {children}
      <Toaster />
      <DeferredAnalytics />
    </ThemeProvider>
  );
}
