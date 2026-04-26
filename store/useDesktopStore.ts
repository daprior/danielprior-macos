import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { noopStorage } from "@/store/noop-storage";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { DesktopStore } from "@/types/components/desktop";
import { createSelectors } from "@/store/createSelectors";

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
      projectFolderPositions: {},
      contactFolderPosition: null,

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

      setProjectFolderPosition: (id, position) => {
        const { projectFolderPositions } = get();
        const current = projectFolderPositions[id];

        if (current && current.x === position.x && current.y === position.y) {
          return;
        }

        set({
          projectFolderPositions: {
            ...projectFolderPositions,
            [id]: position,
          },
        });
      },

      setContactFolderPosition: (position) => {
        const { contactFolderPosition } = get();

        if (
          contactFolderPosition &&
          contactFolderPosition.x === position.x &&
          contactFolderPosition.y === position.y
        ) {
          return;
        }

        set({ contactFolderPosition: position });
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
        projectFolderPositions: state.projectFolderPositions,
        contactFolderPosition: state.contactFolderPosition,
      }),
    },
  ),
);

export const useDesktopStoreSelectors = createSelectors(useDesktopStore);
