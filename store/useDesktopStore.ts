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
  minimizedWindowIds: string[];
  restoringWindowIds: string[];
  openingWindowIds: string[];
  closingWindowIds: string[];
};

type DesktopActions = {
  openApp: (app: AppWindow) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  finishRestoreWindow: (id: string) => void;
  finishOpenWindow: (id: string) => void;
  requestCloseWindow: (id: string) => void;
  clearCloseRequest: (id: string) => void;
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
      minimizedWindowIds: [],
      restoringWindowIds: [],
      openingWindowIds: [],
      closingWindowIds: [],

      openApp: (app) => {
        const {
          openWindows,
          showLaunchpad,
          minimizedWindowIds,
          openingWindowIds,
          closingWindowIds,
        } = get();
        const isOpen = openWindows.some((w) => w.id === app.id);
        const isMinimized = minimizedWindowIds.includes(app.id);

        if (!isOpen) {
          set({
            openWindows: [...openWindows, app],
            activeWindowId: app.id,
            openingWindowIds: openingWindowIds.includes(app.id)
              ? openingWindowIds
              : [...openingWindowIds, app.id],
            closingWindowIds: closingWindowIds.filter((cid) => cid !== app.id),
          });
        }

        if (isOpen && isMinimized) {
          get().restoreWindow(app.id);
        } else if (isOpen) {
          set({ activeWindowId: app.id });
        }

        if (showLaunchpad) {
          set({ showLaunchpad: false });
        }
      },

      closeWindow: (id) => {
        const {
          openWindows,
          activeWindowId,
          minimizedWindowIds,
          restoringWindowIds,
          openingWindowIds,
          closingWindowIds,
        } = get();
        const remaining = openWindows.filter((w) => w.id !== id);
        const nextMinimized = minimizedWindowIds.filter((mid) => mid !== id);
        const nextRestoring = restoringWindowIds.filter((rid) => rid !== id);
        const nextOpening = openingWindowIds.filter((oid) => oid !== id);
        const nextClosing = closingWindowIds.filter((cid) => cid !== id);

        let nextActive: string | null = activeWindowId;
        if (activeWindowId === id) {
          nextActive =
            [...remaining].reverse().find((w) => !nextMinimized.includes(w.id))
              ?.id ?? null;
        }

        if (nextActive && nextMinimized.includes(nextActive)) {
          nextActive =
            [...remaining].reverse().find((w) => !nextMinimized.includes(w.id))
              ?.id ?? null;
        }

        set({
          openWindows: remaining,
          activeWindowId: nextActive,
          minimizedWindowIds: nextMinimized,
          restoringWindowIds: nextRestoring,
          openingWindowIds: nextOpening,
          closingWindowIds: nextClosing,
        });
      },

      minimizeWindow: (id) => {
        const {
          openWindows,
          activeWindowId,
          minimizedWindowIds,
          restoringWindowIds,
        } = get();
        if (minimizedWindowIds.includes(id)) return;

        const nextMinimized = [...minimizedWindowIds, id];
        const nextRestoring = restoringWindowIds.filter((rid) => rid !== id);

        let nextActive: string | null = activeWindowId;
        if (activeWindowId === id) {
          nextActive =
            [...openWindows]
              .reverse()
              .find((w) => w.id !== id && !nextMinimized.includes(w.id))?.id ??
            null;
        }

        set({
          minimizedWindowIds: nextMinimized,
          restoringWindowIds: nextRestoring,
          activeWindowId: nextActive,
        });
      },

      restoreWindow: (id) => {
        const { minimizedWindowIds, restoringWindowIds } = get();
        if (!minimizedWindowIds.includes(id)) {
          set({ activeWindowId: id });
          return;
        }

        const nextRestoring = restoringWindowIds.includes(id)
          ? restoringWindowIds
          : [...restoringWindowIds, id];

        set({
          minimizedWindowIds: minimizedWindowIds.filter((mid) => mid !== id),
          restoringWindowIds: nextRestoring,
          activeWindowId: id,
        });
      },

      finishRestoreWindow: (id) => {
        const { restoringWindowIds } = get();
        if (!restoringWindowIds.includes(id)) return;
        set({
          restoringWindowIds: restoringWindowIds.filter((rid) => rid !== id),
        });
      },

      finishOpenWindow: (id) => {
        const { openingWindowIds } = get();
        if (!openingWindowIds.includes(id)) return;
        set({ openingWindowIds: openingWindowIds.filter((oid) => oid !== id) });
      },

      requestCloseWindow: (id) => {
        const { closingWindowIds } = get();
        if (closingWindowIds.includes(id)) return;
        set({ closingWindowIds: [...closingWindowIds, id] });
      },

      clearCloseRequest: (id) => {
        const { closingWindowIds } = get();
        if (!closingWindowIds.includes(id)) return;
        set({ closingWindowIds: closingWindowIds.filter((cid) => cid !== id) });
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
