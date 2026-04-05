"use client";

import { useTheme } from "next-themes";

export function useIsDarkMode() {
  const { theme, resolvedTheme } = useTheme();
  const current = resolvedTheme ?? theme;
  return { isDarkMode: current === "dark" };
}
