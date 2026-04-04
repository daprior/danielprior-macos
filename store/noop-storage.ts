import type { StateStorage } from "zustand/middleware";

export const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
