import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { noopStorage } from "@/store/noop-storage";
import { createSelectors } from "./createSelectors";

type SoundState = {
  sfxMuted: boolean;
  sfxVolume: number;
};

type SoundActions = {
  setSfxMuted: (muted: boolean) => void;
  toggleSfxMuted: () => void;
  setSfxVolume: (volume: number) => void;
};

export type SoundStore = SoundState & SoundActions;

const clampVolume = (value: number) => Math.max(0, Math.min(100, value));

export const useSoundStore = create<SoundStore>()(
  persist(
    (set, get) => ({
      sfxMuted: false,
      sfxVolume: 80,

      setSfxMuted: (muted) => set({ sfxMuted: muted }),
      toggleSfxMuted: () => set({ sfxMuted: !get().sfxMuted }),
      setSfxVolume: (volume) => set({ sfxVolume: clampVolume(volume) }),
    }),
    {
      name: STORAGE_KEYS.soundState,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({
        sfxMuted: state.sfxMuted,
        sfxVolume: state.sfxVolume,
      }),
    },
  ),
);

export const useSoundStoreSelectors = createSelectors(useSoundStore);
