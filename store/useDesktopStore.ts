import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AppWindow } from "@/types";
import { noopStorage } from "@/store/noop-storage";
import { STORAGE_KEYS } from "@/constants/storage-keys";

type DesktopState = {
  openWindows: AppWindow[];
  activeWindowId: string | null;
  showLaunchpad: boolean;
  showControlCenter: boolean;
  showSpotlight: boolean;
};

type DesktopActions = {
  openApp: (app: AppWindow) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  clearFocus: () => void;

  toggleLaunchpad: () => void;
  setLaunchpadOpen: (open: boolean) => void;
  toggleControlCenter: () => void;
  setControlCenterOpen: (open: boolean) => void;
  toggleSpotlight: () => void;
  setSpotlightOpen: (open: boolean) => void;

  desktopBackgroundClick: () => void;

  setWindowPosition: (id: string, position: AppWindow["position"]) => void;
  setWindowSize: (id: string, size: AppWindow["size"]) => void;
};

export type DesktopStore = DesktopState & DesktopActions;

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      openWindows: [],
      activeWindowId: null,
      showLaunchpad: false,
      showControlCenter: false,
      showSpotlight: false,

      openApp: (app) => {
        const { openWindows, showLaunchpad } = get();
        const isOpen = openWindows.some((w) => w.id === app.id);

        if (!isOpen) {
          set({ openWindows: [...openWindows, app] });
        }

        set({ activeWindowId: app.id });

        if (showLaunchpad) {
          set({ showLaunchpad: false });
        }
      },

      closeWindow: (id) => {
        const { openWindows, activeWindowId } = get();
        const remaining = openWindows.filter((w) => w.id !== id);

        let nextActive: string | null = activeWindowId;
        if (activeWindowId === id) {
          nextActive = remaining.length
            ? remaining[remaining.length - 1].id
            : null;
        }

        set({ openWindows: remaining, activeWindowId: nextActive });
      },

      focusWindow: (id) => set({ activeWindowId: id }),
      clearFocus: () => set({ activeWindowId: null }),

      toggleLaunchpad: () => {
        const { showLaunchpad, showControlCenter, showSpotlight } = get();
        set({ showLaunchpad: !showLaunchpad });
        if (showControlCenter) set({ showControlCenter: false });
        if (showSpotlight) set({ showSpotlight: false });
      },
      setLaunchpadOpen: (open) => set({ showLaunchpad: open }),

      toggleControlCenter: () => {
        const { showControlCenter, showSpotlight } = get();
        set({ showControlCenter: !showControlCenter });
        if (showSpotlight) set({ showSpotlight: false });
      },
      setControlCenterOpen: (open) => set({ showControlCenter: open }),

      toggleSpotlight: () => {
        const { showSpotlight, showControlCenter } = get();
        set({ showSpotlight: !showSpotlight });
        if (showControlCenter) set({ showControlCenter: false });
      },
      setSpotlightOpen: (open) => set({ showSpotlight: open }),

      desktopBackgroundClick: () => {
        const { showControlCenter, showSpotlight } = get();
        set({ activeWindowId: null });
        if (showControlCenter) set({ showControlCenter: false });
        if (showSpotlight) set({ showSpotlight: false });
      },

      setWindowPosition: (id, position) => {
        const { openWindows } = get();
        const next = openWindows.map((w) =>
          w.id === id ? { ...w, position } : w,
        );
        set({ openWindows: next });
      },

      setWindowSize: (id, size) => {
        const { openWindows } = get();
        const next = openWindows.map((w) => (w.id === id ? { ...w, size } : w));
        set({ openWindows: next });
      },
    }),
    {
      name: STORAGE_KEYS.desktopState,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({
        openWindows: state.openWindows,
        activeWindowId: state.activeWindowId,
        showLaunchpad: state.showLaunchpad,
        showControlCenter: state.showControlCenter,
        showSpotlight: state.showSpotlight,
      }),
    },
  ),
);
