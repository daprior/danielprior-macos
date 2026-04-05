"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Minus, ArrowRightIcon as ArrowsMaximize } from "lucide-react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import type { AppWindow } from "@/types";
import Notes from "@/components/apps/notes";
import GitHub from "@/components/apps/github";
import Safari from "@/components/apps/safari";
import VSCode from "@/components/apps/vscode";
import FaceTime from "@/components/apps/facetime";
import Terminal from "@/components/apps/terminal";
import Mail from "@/components/apps/mail";
import YouTube from "@/components/apps/youtube";
import Spotify from "@/components/apps/spotify";
import Snake from "@/components/apps/snake";
import Weather from "@/components/apps/weather";
import { WINDOW_LAYOUT, WINDOW_MIN_SIZE } from "@/constants/window-config";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";

gsap.registerPlugin(Flip);

const componentMap: Record<
  string,
  React.ComponentType<{ isDarkMode?: boolean }>
> = {
  Notes,
  GitHub,
  Safari,
  VSCode,
  FaceTime,
  Terminal,
  Mail,
  YouTube,
  Spotify,
  Snake,
  Weather,
};

interface WindowProps {
  window: AppWindow;
  isActive: boolean;
  windowId: string;
}

export default function Window({
  window: appWindow,
  isActive,
  windowId,
}: WindowProps) {
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
  const minimizedWindowIds = useDesktopStore((s) => s.minimizedWindowIds);
  const restoringWindowIds = useDesktopStore((s) => s.restoringWindowIds);
  const finishRestoreWindow = useDesktopStore((s) => s.finishRestoreWindow);
  const openingWindowIds = useDesktopStore((s) => s.openingWindowIds);
  const finishOpenWindow = useDesktopStore((s) => s.finishOpenWindow);
  const closingWindowIds = useDesktopStore((s) => s.closingWindowIds);
  const clearCloseRequest = useDesktopStore((s) => s.clearCloseRequest);
  const { isDarkMode } = useIsDarkMode();

  const isMinimized = minimizedWindowIds.includes(windowId);
  const isRestoring = restoringWindowIds.includes(windowId);
  const isOpening = openingWindowIds.includes(windowId);
  const isCloseRequested = closingWindowIds.includes(windowId);
  const prefersReducedMotionRef = useRef(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const windowInnerRef = useRef<HTMLDivElement>(null);
  const windowDepthOverlayRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: windowRef });
  const [isAnimatingMinimize, setIsAnimatingMinimize] = useState(false);
  const isAnimating =
    isAnimatingMinimize || isRestoring || isOpening || isCloseRequested;
  const isClosingRef = useRef(false);

  // Base geometry comes from the store (via props). We only keep draft geometry
  // locally during drag/resize to avoid frequent store writes.
  const [draftPosition, setDraftPosition] = useState<
    AppWindow["position"] | null
  >(null);
  const [draftSize, setDraftSize] = useState<AppWindow["size"] | null>(null);
  const position = draftPosition ?? appWindow.position;
  const size = draftSize ?? appWindow.size;

  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState({
    position: appWindow.position,
    size: appWindow.size,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({
    width: 0,
    height: 0,
  });

  const AppComponent = componentMap[appWindow.component];

  const setWindowPosition = useDesktopStore((s) => s.setWindowPosition);
  const setWindowSize = useDesktopStore((s) => s.setWindowSize);

  useGSAP(() => {
    if (typeof window === "undefined") return;
    prefersReducedMotionRef.current =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useGSAP(
    () => {
      const innerEl = windowInnerRef.current;
      const overlayEl = windowDepthOverlayRef.current;
      if (!innerEl || !overlayEl) return;

      if (prefersReducedMotionRef.current) {
        gsap.set(innerEl, { scale: isActive ? 1 : 0.98 });
        gsap.set(overlayEl, { opacity: isActive ? 0 : 0.14 });
        return;
      }

      if (isAnimating || isMinimized) {
        gsap.set(innerEl, { scale: 1 });
        gsap.set(overlayEl, { opacity: 0 });
        return;
      }

      gsap.to(innerEl, {
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
        scale: isActive ? 1 : 0.98,
      });

      gsap.to(overlayEl, {
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
        opacity: isActive ? 0 : 0.14,
      });
    },
    { scope: windowRef, dependencies: [isActive, isAnimating, isMinimized] },
  );

  const getDockTargetRect = useCallback(() => {
    if (typeof document === "undefined") return null;

    const iconEl = document.querySelector<HTMLElement>(
      `[data-dock-app-id="${windowId}"]`,
    );
    if (iconEl) return iconEl.getBoundingClientRect();

    const dockRoot = document.querySelector<HTMLElement>("[data-dock-root]");
    const fallbackSize = { width: 56, height: 56 };

    if (dockRoot) {
      const r = dockRoot.getBoundingClientRect();
      return DOMRect.fromRect({
        x: r.left + r.width / 2 - fallbackSize.width / 2,
        y: r.top + r.height / 2 - fallbackSize.height / 2,
        width: fallbackSize.width,
        height: fallbackSize.height,
      });
    }

    return DOMRect.fromRect({
      x: window.innerWidth / 2 - fallbackSize.width / 2,
      y:
        window.innerHeight -
        WINDOW_LAYOUT.dockReservedHeight / 2 -
        fallbackSize.height / 2,
      width: fallbackSize.width,
      height: fallbackSize.height,
    });
  }, [windowId]);

  const getDockTarget = useCallback(() => {
    if (typeof document === "undefined") return null;

    const iconEl = document.querySelector<HTMLElement>(
      `[data-dock-app-id="${windowId}"]`,
    );
    if (iconEl) return { el: iconEl, cleanup: undefined };

    const rect = getDockTargetRect();
    if (!rect) return null;

    const proxy = document.createElement("div");
    proxy.style.position = "fixed";
    proxy.style.pointerEvents = "none";
    proxy.style.opacity = "0";
    proxy.style.zIndex = "-1";
    document.body.appendChild(proxy);

    proxy.style.left = `${rect.left}px`;
    proxy.style.top = `${rect.top}px`;
    proxy.style.width = `${rect.width}px`;
    proxy.style.height = `${rect.height}px`;

    return { el: proxy, cleanup: () => proxy.remove() };
  }, [getDockTargetRect, windowId]);

  useGSAP(
    () => {
      if (!isOpening) return;
      const windowEl = windowRef.current;
      if (!windowEl) {
        finishOpenWindow(windowId);
        return;
      }

      if (prefersReducedMotionRef.current) {
        gsap.killTweensOf(windowEl);
        gsap.set(windowEl, {
          visibility: "visible",
          opacity: 1,
          pointerEvents: "auto",
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          skewX: 0,
          skewY: 0,
          clearProps: "willChange,filter",
        });
        finishOpenWindow(windowId);
        return;
      }

      const dockTarget = getDockTarget();
      if (!dockTarget) {
        finishOpenWindow(windowId);
        return;
      }
      const targetEl = dockTarget.el;

      gsap.killTweensOf(windowEl);
      Flip.killFlipsOf(windowEl);

      gsap.set(windowEl, {
        visibility: "visible",
        opacity: 1,
        pointerEvents: "none",
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        transformOrigin: "bottom center",
        willChange: "transform, opacity",
      });

      const finalState = Flip.getState(windowEl, { props: "opacity" });

      const fromRect = windowEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const fromCenterX = fromRect.left + fromRect.width / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const deltaX = targetCenterX - fromCenterX;

      const skewX = Math.max(
        -12,
        Math.min(12, (deltaX / Math.max(1, window.innerWidth)) * 28),
      );

      Flip.fit(windowEl, targetEl, {
        duration: 0,
        scale: true,
      });

      dockTarget.cleanup?.();

      gsap.set(windowEl, {
        opacity: 0,
        skewX,
      });

      Flip.to(finalState, {
        duration: 0.56,
        ease: "power3.out",
        scale: true,
        clearProps: false,
        onComplete: () => {
          gsap.set(windowEl, {
            clearProps:
              "transform,opacity,visibility,pointerEvents,willChange,filter",
          });
          finishOpenWindow(windowId);
        },
      });
    },
    {
      scope: windowRef,
      dependencies: [finishOpenWindow, getDockTarget, isOpening, windowId],
    },
  );

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useGSAP(
    () => {
      const windowEl = windowRef.current;
      if (!windowEl) return;

      if (!isMinimized) return;

      gsap.killTweensOf(windowEl);
      gsap.set(windowEl, {
        visibility: "hidden",
        opacity: 0,
        pointerEvents: "none",
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        clearProps: "filter,willChange",
      });
    },
    { scope: windowRef, dependencies: [isMinimized] },
  );

  useGSAP(
    () => {
      if (!isRestoring) return;
      const windowEl = windowRef.current;
      if (!windowEl) {
        finishRestoreWindow(windowId);
        return;
      }

      if (prefersReducedMotionRef.current) {
        gsap.killTweensOf(windowEl);
        gsap.set(windowEl, {
          visibility: "visible",
          opacity: 1,
          pointerEvents: "auto",
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          skewX: 0,
          skewY: 0,
          clearProps: "willChange,filter",
        });
        finishRestoreWindow(windowId);
        return;
      }

      const dockTarget = getDockTarget();
      if (!dockTarget) {
        finishRestoreWindow(windowId);
        return;
      }
      const targetEl = dockTarget.el;

      gsap.killTweensOf(windowEl);
      Flip.killFlipsOf(windowEl);

      gsap.set(windowEl, {
        visibility: "visible",
        opacity: 1,
        pointerEvents: "none",
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        transformOrigin: "bottom center",
        willChange: "transform, opacity",
      });

      const finalState = Flip.getState(windowEl, { props: "opacity" });

      const fromRect = windowEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const fromCenterX = fromRect.left + fromRect.width / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const deltaX = targetCenterX - fromCenterX;
      const skewX = Math.max(
        -12,
        Math.min(12, (deltaX / Math.max(1, window.innerWidth)) * 28),
      );

      Flip.fit(windowEl, targetEl, {
        duration: 0,
        scale: true,
      });

      dockTarget.cleanup?.();

      gsap.set(windowEl, {
        opacity: 0,
        skewX,
      });

      Flip.to(finalState, {
        duration: 0.52,
        ease: "power3.out",
        scale: true,
        clearProps: false,
        onComplete: () => {
          gsap.set(windowEl, {
            clearProps:
              "transform,opacity,visibility,pointerEvents,willChange,filter",
          });
          finishRestoreWindow(windowId);
        },
      });
    },
    {
      scope: windowRef,
      dependencies: [
        finishRestoreWindow,
        getDockTarget,
        getDockTargetRect,
        isRestoring,
        windowId,
      ],
    },
  );

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    if (isMinimized) {
      closeWindow(windowId);
      return;
    }

    contextSafe(() => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;

      // Stop any in-progress interactions
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);

      const windowEl = windowRef.current;
      if (!windowEl || prefersReducedMotionRef.current) {
        closeWindow(windowId);
        return;
      }

      const dockTarget = getDockTarget();
      if (!dockTarget) {
        closeWindow(windowId);
        return;
      }
      const targetEl = dockTarget.el;

      gsap.killTweensOf(windowEl);
      Flip.killFlipsOf(windowEl);

      const fromRect = windowEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const fromCenterX = fromRect.left + fromRect.width / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const deltaX = targetCenterX - fromCenterX;

      const skewX = Math.max(
        -12,
        Math.min(12, (deltaX / Math.max(1, window.innerWidth)) * 28),
      );

      gsap.set(windowEl, {
        visibility: "visible",
        pointerEvents: "none",
        transformOrigin: "bottom center",
        willChange: "transform, opacity",
      });

      const fromState = Flip.getState(windowEl, { props: "opacity" });

      Flip.fit(windowEl, targetEl, {
        duration: 0,
        scale: true,
      });

      dockTarget.cleanup?.();

      gsap.set(windowEl, {
        opacity: 0,
        skewX,
      });

      Flip.from(fromState, {
        duration: 0.54,
        ease: "power3.inOut",
        scale: true,
        clearProps: false,
        onComplete: () => closeWindow(windowId),
      });
    })();
  }, [closeWindow, contextSafe, getDockTarget, isMinimized, windowId]);

  useGSAP(
    () => {
      if (!isCloseRequested) return;
      clearCloseRequest(windowId);
      handleClose();
    },
    {
      scope: windowRef,
      dependencies: [
        clearCloseRequest,
        handleClose,
        isCloseRequested,
        windowId,
      ],
    },
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setDraftPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (isResizing && resizeDirection) {
        e.preventDefault();
        const dx = e.clientX - resizeStartPos.x;
        const dy = e.clientY - resizeStartPos.y;

        let newWidth = resizeStartSize.width;
        let newHeight = resizeStartSize.height;
        let newX = position.x;
        let newY = position.y;

        // Minimum window dimensions
        const minWidth = WINDOW_MIN_SIZE.width;
        const minHeight = WINDOW_MIN_SIZE.height;

        if (resizeDirection.includes("e")) {
          newWidth = Math.max(minWidth, resizeStartSize.width + dx);
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(minHeight, resizeStartSize.height + dy);
        }
        if (resizeDirection.includes("w")) {
          const proposedWidth = resizeStartSize.width - dx;
          if (proposedWidth >= minWidth) {
            newWidth = proposedWidth;
            newX = position.x + dx;
          }
        }
        if (resizeDirection.includes("n")) {
          const proposedHeight = resizeStartSize.height - dy;
          if (proposedHeight >= minHeight) {
            newHeight = proposedHeight;
            newY = position.y + dy;
          }
        }

        setDraftSize({ width: newWidth, height: newHeight });
        if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
          setDraftPosition({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);

      // Commit geometry to store for persistence
      setWindowPosition(windowId, positionRef.current);
      setWindowSize(windowId, sizeRef.current);

      // Clear draft geometry; next render will use store values.
      setDraftPosition(null);
      setDraftSize(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    dragOffset,
    isResizing,
    resizeDirection,
    resizeStartPos,
    resizeStartSize,
    position,
    size,
    setWindowPosition,
    setWindowSize,
    windowId,
  ]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMinimized || isAnimating) return;

    // Prevent dragging when clicking on buttons
    if ((e.target as HTMLElement).closest(".window-controls")) {
      return;
    }

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });

    focusWindow(windowId);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    if (isMinimized || isAnimating) return;
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY,
    });
    setResizeStartSize({
      width: size.width,
      height: size.height,
    });

    focusWindow(windowId);
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore previous state
      positionRef.current = preMaximizeState.position;
      sizeRef.current = preMaximizeState.size;
      setDraftPosition(preMaximizeState.position);
      setDraftSize(preMaximizeState.size);
      setWindowPosition(windowId, preMaximizeState.position);
      setWindowSize(windowId, preMaximizeState.size);

      // Clear draft after commit
      setDraftPosition(null);
      setDraftSize(null);
    } else {
      // Save current state before maximizing
      setPreMaximizeState({ position, size });

      // Get the available space (accounting for menubar)
      const availableHeight = window.innerHeight - 26; // 6px for menubar + 20px padding

      // Maximize
      const nextPosition = { x: 0, y: 26 };
      const nextSize = {
        width: window.innerWidth,
        height: availableHeight - 70, // Account for dock
      };

      positionRef.current = nextPosition;
      sizeRef.current = nextSize;
      setDraftPosition(nextPosition);
      setDraftSize(nextSize);
      setWindowPosition(windowId, nextPosition);
      setWindowSize(windowId, nextSize);

      // Clear draft after commit
      setDraftPosition(null);
      setDraftSize(null);
    }

    setIsMaximized(!isMaximized);
  };

  // Minimize with a Dock-targeted "Genie" animation
  const handleMinimize = () => {
    contextSafe(() => {
      if (isMinimized || isAnimatingMinimize || isRestoring) return;

      // Stop any in-progress interactions
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);

      if (prefersReducedMotionRef.current) {
        minimizeWindow(windowId);
        return;
      }

      const windowEl = windowRef.current;
      if (!windowEl) {
        minimizeWindow(windowId);
        return;
      }

      const dockTarget = getDockTarget();
      if (!dockTarget) {
        minimizeWindow(windowId);
        return;
      }
      const targetEl = dockTarget.el;

      gsap.killTweensOf(windowEl);
      Flip.killFlipsOf(windowEl);
      setIsAnimatingMinimize(true);

      const fromRect = windowEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const fromCenterX = fromRect.left + fromRect.width / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const deltaX = targetCenterX - fromCenterX;
      const skewX = Math.max(
        -12,
        Math.min(12, (deltaX / Math.max(1, window.innerWidth)) * 28),
      );

      gsap.set(windowEl, {
        visibility: "visible",
        pointerEvents: "none",
        transformOrigin: "bottom center",
        willChange: "transform, opacity",
      });

      const fromState = Flip.getState(windowEl, { props: "opacity" });

      Flip.fit(windowEl, targetEl, {
        duration: 0,
        scale: true,
      });

      dockTarget.cleanup?.();

      gsap.set(windowEl, {
        opacity: 0,
        skewX,
      });

      Flip.from(fromState, {
        duration: 0.58,
        ease: "power3.inOut",
        scale: true,
        clearProps: false,
        onComplete: () => {
          minimizeWindow(windowId);
          setIsAnimatingMinimize(false);
        },
      });
    })();
  };

  const titleBarClass = isDarkMode
    ? isActive
      ? "bg-gray-800"
      : "bg-gray-900"
    : isActive
      ? "bg-gray-200"
      : "bg-gray-100";

  const contentBgClass = isDarkMode ? "bg-gray-900" : "bg-white";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";

  return (
    <div
      ref={windowRef}
      data-role="window"
      className={`absolute rounded-lg overflow-hidden shadow-2xl transition-shadow ${isActive ? "shadow-2xl" : "shadow-lg"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: isAnimating ? 60 : isActive ? 10 : 0,
        pointerEvents: isMinimized || isAnimating ? "none" : "auto",
      }}
      onMouseDown={() => {
        if (isMinimized || isAnimating) return;
        focusWindow(windowId);
      }}
    >
      <div
        ref={windowInnerRef}
        data-role="window-inner"
        className="relative h-full w-full"
      >
        <div
          ref={windowDepthOverlayRef}
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: 0 }}
        />

        {/* Title bar */}
        <div
          className={`h-8 flex items-center px-3 ${titleBarClass}`}
          onMouseDown={handleTitleBarMouseDown}
        >
          <div className="window-controls flex items-center space-x-2 mr-4">
            <button
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
              onClick={handleClose}
            >
              <X className="w-2 h-2 text-red-800 opacity-0 hover:opacity-100" />
            </button>
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center"
              onClick={handleMinimize}
            >
              <Minus className="w-2 h-2 text-yellow-800 opacity-0 hover:opacity-100" />
            </button>
            <button
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
              onClick={toggleMaximize}
            >
              <ArrowsMaximize className="w-2 h-2 text-green-800 opacity-0 hover:opacity-100" />
            </button>
          </div>

          <div
            className={`flex-1 text-center text-sm font-medium truncate ${textClass}`}
          >
            {appWindow.title}
          </div>

          <div className="w-16">{/* Spacer to balance the title */}</div>
        </div>

        {/* Window content */}
        <div className={`${contentBgClass} h-[calc(100%-2rem)] overflow-auto`}>
          {AppComponent ? (
            <AppComponent isDarkMode={isDarkMode} />
          ) : (
            <div className="p-4">Content not available</div>
          )}
        </div>

        {/* Resize handles */}
        {!isMaximized && !isMinimized && !isAnimating && (
          <>
            {/* Corner resize handles */}
            <div
              className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, "se")}
            />

            {/* Edge resize handles */}
            <div
              className="absolute top-0 left-4 right-4 h-2 cursor-n-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, "n")}
            />
            <div
              className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, "s")}
            />
            <div
              className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, "w")}
            />
            <div
              className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize z-20"
              onMouseDown={(e) => handleResizeMouseDown(e, "e")}
            />
          </>
        )}
      </div>
    </div>
  );
}
