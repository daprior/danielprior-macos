import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { noopStorage } from "@/store/noop-storage";
import { CONTROL_CENTER_CONFIG } from "@/constants/ui-config";
import type { WallpaperId, AccentColorId } from "@/constants/appearance-config";
import { createSelectors } from "./createSelectors";

type SettingsState = {
  screenBrightness: number;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  volume: number;
  reduceMotion: boolean;
  wallpaperId: WallpaperId;
  accentColorId: AccentColorId;
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
};

type SettingsActions = {
  setBrightness: (value: number) => void;
  setWifiEnabled: (enabled: boolean) => void;
  toggleWifi: () => void;
  setBluetoothEnabled: (enabled: boolean) => void;
  toggleBluetooth: () => void;
  setVolume: (value: number) => void;
  setReduceMotion: (enabled: boolean) => void;
  setWallpaperId: (id: WallpaperId) => void;
  setAccentColorId: (id: AccentColorId) => void;
  setFontSize: (size: "small" | "medium" | "large") => void;
  setHighContrast: (enabled: boolean) => void;
};

export type SettingsStore = SettingsState & SettingsActions;

const getInitialBrightness = () => {
  if (typeof window === "undefined") return 90;
  const saved = window.localStorage.getItem(STORAGE_KEYS.screenBrightness);
  if (saved === null) return 90;
  const parsed = Number.parseInt(saved, 10);
  return Number.isFinite(parsed) ? parsed : 90;
};

const getInitialWifi = () => {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem(STORAGE_KEYS.wifiEnabled);
  if (saved === null) return true;
  return saved === "true";
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      screenBrightness: getInitialBrightness(),
      wifiEnabled: getInitialWifi(),
      bluetoothEnabled: true,
      volume: CONTROL_CENTER_CONFIG.defaultVolume,
      reduceMotion: false,
      wallpaperId: "default" as WallpaperId,
      accentColorId: "blue" as AccentColorId,
      fontSize: "medium" as const,
      highContrast: false,

      setBrightness: (value) => {
        set({ screenBrightness: value });
        try {
          window.localStorage.setItem(
            STORAGE_KEYS.screenBrightness,
            value.toString(),
          );
        } catch {
          // ignore
        }
      },

      setWifiEnabled: (enabled) => {
        set({ wifiEnabled: enabled });
        try {
          window.localStorage.setItem(
            STORAGE_KEYS.wifiEnabled,
            enabled.toString(),
          );
        } catch {
          // ignore
        }
      },

      toggleWifi: () => {
        const next = !get().wifiEnabled;
        get().setWifiEnabled(next);
      },

      setBluetoothEnabled: (enabled) => set({ bluetoothEnabled: enabled }),
      toggleBluetooth: () => set({ bluetoothEnabled: !get().bluetoothEnabled }),
      setVolume: (value) => set({ volume: value }),
      setReduceMotion: (enabled) => set({ reduceMotion: enabled }),
      setWallpaperId: (id) => set({ wallpaperId: id }),
      setAccentColorId: (id) => set({ accentColorId: id }),
      setFontSize: (size) => set({ fontSize: size }),
      setHighContrast: (enabled) => set({ highContrast: enabled }),
    }),
    {
      name: STORAGE_KEYS.settingsState,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SettingsStore>;
        return {
          ...currentState,
          ...persisted,
          wallpaperId: currentState.wallpaperId,
        };
      },
      partialize: (state) => ({
        screenBrightness: state.screenBrightness,
        wifiEnabled: state.wifiEnabled,
        bluetoothEnabled: state.bluetoothEnabled,
        volume: state.volume,
        reduceMotion: state.reduceMotion,
        accentColorId: state.accentColorId,
        fontSize: state.fontSize,
        highContrast: state.highContrast,
      }),
    },
  ),
);

export const useSettingsStoreSelectors = createSelectors(useSettingsStore);
