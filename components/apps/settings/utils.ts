import type { SettingsThemeClasses } from "@/types/apps/settings";

export const getSettingsThemeClasses = (
  isDarkMode: boolean,
): SettingsThemeClasses => ({
  textColor: isDarkMode ? "text-white" : "text-gray-800",
  bgColor: isDarkMode ? "bg-gray-900" : "bg-white",
  sidebarBg: isDarkMode ? "bg-gray-800" : "bg-gray-100",
  cardBg: isDarkMode ? "bg-gray-800" : "bg-gray-100",
  hoverBg: isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200",
  secondaryText: isDarkMode ? "text-gray-400" : "text-gray-600",
  subtleText: isDarkMode ? "text-gray-400" : "text-gray-500",
});
