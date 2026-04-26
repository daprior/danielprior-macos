import type { AppWindow, GitHubProjectSummary } from "@/types";

export type AppWindowContentProps = {
  isDarkMode?: boolean;
  project?: GitHubProjectSummary | null;
};

export interface WindowProps {
  window: AppWindow;
  isActive: boolean;
  windowId: string;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface DragState {
  x: number;
  y: number;
}

export interface ResizeState {
  x: number;
  y: number;
}

export interface DockTarget {
  el: HTMLElement;
  cleanup?: () => void;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface UseWindowActionsProps {
  windowId: string;
  windowRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  isMaximized: boolean;
  setIsMaximized: React.Dispatch<React.SetStateAction<boolean>>;
  preMaximizeState: { position: WindowPosition; size: WindowSize };
  setPreMaximizeState: React.Dispatch<
    React.SetStateAction<{ position: WindowPosition; size: WindowSize }>
  >;
  // نوع صارم لدالة contextSafe من GSAP
  contextSafe: <T extends (...args: never[]) => unknown>(func: T) => T;
  isMinimized: boolean;
  isAnimatingMinimize: boolean;
  setIsAnimatingMinimize: React.Dispatch<React.SetStateAction<boolean>>;
  isRestoring: boolean;
  isMinimizeDisabled: boolean;
  prefersReducedMotionRef: React.MutableRefObject<boolean>;
  isClosingRef: React.MutableRefObject<boolean>;

  dragResizeProps: {
    position: WindowPosition;
    size: WindowSize;
    positionRef: React.MutableRefObject<WindowPosition>;
    sizeRef: React.MutableRefObject<WindowSize>;
    setDraftPosition: React.Dispatch<
      React.SetStateAction<WindowPosition | null>
    >;
    setDraftSize: React.Dispatch<React.SetStateAction<WindowSize | null>>;
    stopInteractions: () => void;
  };

  actions: {
    setWindowPosition: (windowId: string, position: WindowPosition) => void;
    setWindowSize: (windowId: string, size: WindowSize) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    playSwitchOn: () => void;
    playSwitchOff: () => void;
    playMinimizeWindow: () => void;
    playCloseWindow: () => void;
  };
}
