import { useIsDarkMode } from "@/hooks/use-is-dark-mode";

export default function Wallpaper() {
  const { isDarkMode } = useIsDarkMode();
  return (
    <div
      className="absolute inset-0 bg-cover bg-center transition-all duration-500"
      style={{
        backgroundImage: isDarkMode
          ? "url('/wallpaper-night.jpg')"
          : "url('/wallpaper-day.jpg')",
      }}
    />
  );
}
