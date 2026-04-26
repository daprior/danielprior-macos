import { AppWindow } from "@/types";

export interface DesktopPosition {
  x: number;
  y: number;
}

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
  projectFolderPositions: Record<string, DesktopPosition>;
  contactFolderPosition: DesktopPosition | null;
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
  setProjectFolderPosition: (id: string, position: DesktopPosition) => void;
  setContactFolderPosition: (position: DesktopPosition) => void;
};

export type DesktopStore = DesktopState & DesktopActions;
