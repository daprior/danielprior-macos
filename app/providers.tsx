"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useTheme } from "next-themes";

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
    </ThemeProvider>
  );
}
