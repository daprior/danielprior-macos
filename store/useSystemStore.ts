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
  setSystemState: (state: SystemState) => void;
  login: () => void;
  logout: () => void;
  sleep: () => void;
  wakeUp: () => void;
  shutdown: () => void;
  boot: () => void;
  restart: () => void;
};

export const useSystemStore = create<SystemStore>((set) => ({
  systemState: "booting",
  setSystemState: (systemState) => set({ systemState }),
  login: () => set({ systemState: "desktop" }),
  logout: () => set({ systemState: "login" }),
  sleep: () => set({ systemState: "sleeping" }),
  wakeUp: () => set({ systemState: "login" }),
  shutdown: () => set({ systemState: "shutdown" }),
  boot: () => set({ systemState: "booting" }),
  restart: () => set({ systemState: "restarting" }),
}));
