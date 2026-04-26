import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import {
  ACCENT_COLORS,
  THEME_PRESETS,
  type AccentColorId,
  type WallpaperId,
  WALLPAPERS,
} from "@/constants/appearance-config";

interface AppearanceSectionProps {
  cardBg: string;
  secondaryText: string;
  isDarkMode: boolean;
  isDarkTheme: boolean;
  wallpaperId: WallpaperId;
  accentColorId: AccentColorId;
  onThemeToggle: () => void;
  onWallpaperChange: (id: WallpaperId) => void;
  onAccentChange: (id: AccentColorId) => void;
  onPresetApply: (
    wallpaperId: WallpaperId,
    accentColorId: AccentColorId,
    isDark: boolean,
  ) => void;
}

export function AppearanceSection({
  cardBg,
  secondaryText,
  isDarkMode,
  isDarkTheme,
  wallpaperId,
  accentColorId,
  onThemeToggle,
  onWallpaperChange,
  onAccentChange,
  onPresetApply,
}: AppearanceSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Appearance</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Display Mode</h3>
          <div className={`${cardBg} p-4 rounded-lg space-y-3`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {isDarkTheme ? "Dark Mode" : "Light Mode"}
                </p>
                <p className={`text-sm ${secondaryText}`}>
                  Switch the full desktop appearance.
                </p>
              </div>
              <button
                type="button"
                onClick={onThemeToggle}
                className="inline-flex items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
              >
                {isDarkTheme ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {isDarkTheme ? "Switch to Day" : "Switch to Night"}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Quick Presets</h3>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onPresetApply(
                    preset.wallpaperId,
                    preset.accentColorId,
                    preset.isDarkMode,
                  )
                }
                className={`p-3 rounded-lg transition-all border-2 ${
                  wallpaperId === preset.wallpaperId &&
                  accentColorId === preset.accentColorId
                    ? "border-blue-500 bg-blue-500/10"
                    : isDarkMode
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <p className="font-medium text-sm">{preset.name}</p>
                <p className={`text-xs ${secondaryText}`}>
                  {preset.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Wallpapers</h3>
          <div className="grid gap-3 grid-cols-3 sm:grid-cols-4">
            {WALLPAPERS.map((wallpaper) => (
              <button
                key={wallpaper.id}
                type="button"
                onClick={() => onWallpaperChange(wallpaper.id)}
                className={`relative rounded-lg overflow-hidden border-2 aspect-video transition-all ${
                  wallpaperId === wallpaper.id
                    ? "border-blue-500"
                    : isDarkMode
                      ? "border-gray-600"
                      : "border-gray-300"
                }`}
              >
                <Image
                  src={wallpaper.thumbSrc}
                  alt={wallpaper.name}
                  fill
                  sizes="(max-width: 640px) 33vw, 25vw"
                  className="object-cover"
                  quality={75}
                  loading="lazy"
                />
                {wallpaperId === wallpaper.id && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                  <p className="text-xs text-white truncate">
                    {wallpaper.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Accent Color</h3>
          <div className="flex flex-wrap gap-3">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => onAccentChange(color.id)}
                className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                  accentColorId === color.id
                    ? "border-white scale-110"
                    : isDarkMode
                      ? "border-gray-600"
                      : "border-gray-300"
                }`}
                style={{ backgroundColor: color.light }}
                title={color.name}
              >
                {accentColorId === color.id && (
                  <div className="absolute inset-1 rounded-full border-2 border-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
