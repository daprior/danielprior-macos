interface AccessibilitySectionProps {
  cardBg: string;
  secondaryText: string;
  reduceMotion: boolean;
  onReduceMotionToggle: () => void;
  isReducedMotion: boolean;
  fontSize: "small" | "medium" | "large";
  onFontSizeChange: (size: "small" | "medium" | "large") => void;
  highContrast: boolean;
  onHighContrastToggle: () => void;
  isDarkMode: boolean;
}

export function AccessibilitySection({
  cardBg,
  secondaryText,
  reduceMotion,
  onReduceMotionToggle,
  isReducedMotion,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastToggle,
  isDarkMode,
}: AccessibilitySectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Accessibility</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Motion</h3>
          <div className={`${cardBg} p-4 rounded-lg space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reduce Motion</p>
                <p className={`text-sm ${secondaryText}`}>
                  Disable interface animations like app/window transitions and
                  terminal typing effects.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={onReduceMotionToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <p className={`text-sm ${secondaryText}`}>
              {isReducedMotion
                ? "Reduce Motion is active (from Settings or system preference)."
                : "Reduce Motion is currently off."}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Display</h3>
          <div className={`${cardBg} p-4 rounded-lg space-y-4`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium">Text Size</p>
                <span className={`text-sm ${secondaryText}`}>
                  {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
                </span>
              </div>
              <div className="flex gap-2">
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onFontSizeChange(size)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm font-medium ${
                      fontSize === size
                        ? "bg-blue-500 text-white"
                        : isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600"
                          : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">High Contrast</p>
                <p className={`text-sm ${secondaryText}`}>
                  Increase color contrast for better visibility.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={onHighContrastToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
