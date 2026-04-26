"use client";

import { SettingsSidebar } from "./components/settings-sidebar";
import { AccessibilitySection } from "./components/sections/accessibility-section";
import { AppearanceSection } from "./components/sections/appearance-section";
import { GeneralSection } from "./components/sections/general-section";
import { NotificationsSection } from "./components/sections/notifications-section";
import { SoundSection } from "./components/sections/sound-section";
import { UnderDevelopmentSection } from "./components/sections/under-development-section";
import { WifiSection } from "./components/sections/wifi-section";
import type { SettingsProps } from "@/types/apps/settings";
import { useSettingsController } from "./hooks/use-settings-controller";

export default function Settings({ isDarkMode = true }: SettingsProps) {
  const {
    activeSection,
    setActiveSection,
    textColor,
    bgColor,
    sidebarBg,
    cardBg,
    hoverBg,
    secondaryText,
    subtleText,
    isReducedMotion,
    isDarkTheme,
    sfxMuted,
    sfxVolume,
    globalMusicMuted,
    averageMusicVolumePercent,
    reduceMotion,
    wallpaperId,
    accentColorId,
    fontSize,
    highContrast,
    wifiEnabled,
    wifiSignal,
    wifiStatusLabel,
    wifiStatusTone,
    handleMuteToggle,
    handleGlobalMusicMuteToggle,
    handleReduceMotionToggle,
    handleGlobalMusicVolumeChange,
    handleThemeToggle,
    handlePresetApply,
    handleWifiToggle,
    openContactApp,
    handlePreviewNotification,
    handleSnakeNotificationPreview,
    onSfxVolumeChange,
    setFontSize,
    setHighContrast,
    onWallpaperChange,
    onAccentChange,
    isUnderDevelopmentSection,
  } = useSettingsController({ isDarkMode });

  return (
    <div className={`flex h-full overflow-hidden ${bgColor} ${textColor}`}>
      <SettingsSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
        sidebarBg={sidebarBg}
        hoverBg={hoverBg}
      />

      <div className="flex-1 h-full overflow-y-auto p-6">
        {activeSection === "general" && (
          <GeneralSection
            cardBg={cardBg}
            secondaryText={secondaryText}
            isReducedMotion={isReducedMotion}
            globalMusicMuted={globalMusicMuted}
            sfxMuted={sfxMuted}
            isDarkMode={isDarkMode}
          />
        )}

        {activeSection === "appearance" && (
          <AppearanceSection
            cardBg={cardBg}
            secondaryText={secondaryText}
            isDarkMode={isDarkMode}
            isDarkTheme={isDarkTheme}
            wallpaperId={wallpaperId}
            accentColorId={accentColorId}
            onThemeToggle={handleThemeToggle}
            onWallpaperChange={onWallpaperChange}
            onAccentChange={onAccentChange}
            onPresetApply={handlePresetApply}
          />
        )}

        {activeSection === "sound" && (
          <SoundSection
            cardBg={cardBg}
            secondaryText={secondaryText}
            globalMusicMuted={globalMusicMuted}
            onGlobalMusicMuteToggle={handleGlobalMusicMuteToggle}
            averageMusicVolumePercent={averageMusicVolumePercent}
            onGlobalMusicVolumeChange={handleGlobalMusicVolumeChange}
            sfxMuted={sfxMuted}
            onMuteToggle={handleMuteToggle}
            sfxVolume={sfxVolume}
            onSfxVolumeChange={onSfxVolumeChange}
          />
        )}

        {activeSection === "accessibility" && (
          <AccessibilitySection
            cardBg={cardBg}
            secondaryText={secondaryText}
            reduceMotion={reduceMotion}
            onReduceMotionToggle={handleReduceMotionToggle}
            isReducedMotion={isReducedMotion}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            highContrast={highContrast}
            onHighContrastToggle={() => setHighContrast(!highContrast)}
            isDarkMode={isDarkMode}
          />
        )}

        {activeSection === "wifi" && (
          <WifiSection
            cardBg={cardBg}
            secondaryText={secondaryText}
            wifiEnabled={wifiEnabled}
            wifiStatusTone={wifiStatusTone}
            wifiStatusLabel={wifiStatusLabel}
            wifiSignal={wifiSignal}
            onWifiToggle={handleWifiToggle}
          />
        )}

        {activeSection === "notifications" && (
          <NotificationsSection
            cardBg={cardBg}
            secondaryText={secondaryText}
            onPreviewNotification={handlePreviewNotification}
            onOpenContactApp={openContactApp}
            onSnakePreview={handleSnakeNotificationPreview}
          />
        )}

        {isUnderDevelopmentSection && (
          <UnderDevelopmentSection
            activeSection={activeSection}
            subtleText={subtleText}
          />
        )}
      </div>
    </div>
  );
}
