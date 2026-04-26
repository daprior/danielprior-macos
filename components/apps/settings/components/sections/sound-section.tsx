interface SoundSectionProps {
  cardBg: string;
  secondaryText: string;
  globalMusicMuted: boolean;
  onGlobalMusicMuteToggle: () => void;
  averageMusicVolumePercent: number;
  onGlobalMusicVolumeChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  sfxMuted: boolean;
  onMuteToggle: () => void;
  sfxVolume: number;
  onSfxVolumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SoundSection({
  cardBg,
  secondaryText,
  globalMusicMuted,
  onGlobalMusicMuteToggle,
  averageMusicVolumePercent,
  onGlobalMusicVolumeChange,
  sfxMuted,
  onMuteToggle,
  sfxVolume,
  onSfxVolumeChange,
}: SoundSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Sound</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Sound Effects</h3>
          <div className={`${cardBg} p-4 rounded-lg space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Global music mute</p>
                <p className={`text-sm ${secondaryText}`}>
                  Mute Music and Spotify apps globally without pausing playback.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalMusicMuted}
                  onChange={onGlobalMusicMuteToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Global Music Volume</p>
                <span className={`text-sm ${secondaryText}`}>
                  {averageMusicVolumePercent}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={averageMusicVolumePercent}
                onChange={onGlobalMusicVolumeChange}
                className="w-full accent-green-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable UI sound effects</p>
                <p className={`text-sm ${secondaryText}`}>
                  System and interaction sounds across the desktop UI.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!sfxMuted}
                  onChange={onMuteToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">SFX Volume</p>
                <span className={`text-sm ${secondaryText}`}>{sfxVolume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={sfxVolume}
                onChange={onSfxVolumeChange}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
