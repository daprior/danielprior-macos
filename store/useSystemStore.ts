import { create } from "zustand";

export type SystemState =
  | "booting"
  | "login"
  | "desktop"
  | "sleeping"
  | "shutdown"
  | "restarting";

type SystemStore = {
  systemState: SystemState;
  desktopIntroNonce: number;
  desktopIntroLastPlayedNonce: number;
  setSystemState: (state: SystemState) => void;
  login: () => void;
  markDesktopIntroPlayed: (nonce: number) => void;
  logout: () => void;
  sleep: () => void;
  wakeUp: () => void;
  shutdown: () => void;
  boot: () => void;
  restart: () => void;
};

export const useSystemStore = create<SystemStore>((set) => ({
  systemState: "booting",
  desktopIntroNonce: 0,
  desktopIntroLastPlayedNonce: 0,
  setSystemState: (systemState) => set({ systemState }),
  login: () =>
    set((s) => ({
      systemState: "desktop",
      desktopIntroNonce: s.desktopIntroNonce + 1,
    })),
  markDesktopIntroPlayed: (nonce) =>
    set((s) => ({
      desktopIntroLastPlayedNonce:
        nonce > s.desktopIntroLastPlayedNonce
          ? nonce
          : s.desktopIntroLastPlayedNonce,
    })),
  logout: () => set({ systemState: "login" }),
  sleep: () => set({ systemState: "sleeping" }),
  wakeUp: () => set({ systemState: "login" }),
  shutdown: () => set({ systemState: "shutdown" }),
  boot: () => set({ systemState: "booting" }),
  restart: () => set({ systemState: "restarting" }),
}));
