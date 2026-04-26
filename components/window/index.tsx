"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import {
  APP_WINDOW_DEFAULT_SIZE,
  WINDOW_LAYOUT,
} from "@/constants/window-config";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
import { useUISound } from "@/hooks/useUISounds";
import { useIsMobile } from "@/hooks/use-mobile";
import { componentMap } from "./components/app-loader";
import type { WindowProps } from "@/types/components/window";
import { calculateWindowSkew } from "@/lib/window/resize";
import { getDockTarget } from "@/lib/window/dock";
import { WindowFrame } from "./components/window-frame";
import { useWindowDragResize } from "./hooks/use-window-drag-resize";
import { useWindowMotionPreference } from "./hooks/use-window-motion";
import { useWindowActions } from "./hooks/useWindowActions";

gsap.registerPlugin(Flip);

export default function Window({
  window: appWindow,
  isActive,
  windowId,
}: WindowProps) {
  const {
    playSwoosh,
    playCloseWindow,
    playMinimizeWindow,
    playSwitchOn,
    playSwitchOff,
  } = useUISound();

  // Desktop state
  const closeWindow = useDesktopStore((state) => state.closeWindow);
  const focusWindow = useDesktopStore((state) => state.focusWindow);
  const minimizeWindow = useDesktopStore((state) => state.minimizeWindow);
  const minimizedWindowIds = useDesktopStore(
    (state) => state.minimizedWindowIds,
  );
  const restoringWindowIds = useDesktopStore(
    (state) => state.restoringWindowIds,
  );
  const finishRestoreWindow = useDesktopStore(
    (state) => state.finishRestoreWindow,
  );
  const openingWindowIds = useDesktopStore((state) => state.openingWindowIds);
  const finishOpenWindow = useDesktopStore((state) => state.finishOpenWindow);
  const closingWindowIds = useDesktopStore((state) => state.closingWindowIds);
  const clearCloseRequest = useDesktopStore((state) => state.clearCloseRequest);
  const setWindowPosition = useDesktopStore((state) => state.setWindowPosition);
  const setWindowSize = useDesktopStore((state) => state.setWindowSize);

  // settings state
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  // Theme
  const { isDarkMode } = useIsDarkMode();
  // Mobile
  const isMobile = useIsMobile();

  // Window state
  const isMinimized = minimizedWindowIds.includes(windowId);
  const isRestoring = restoringWindowIds.includes(windowId);
  const isOpening = openingWindowIds.includes(windowId);
  const isCloseRequested = closingWindowIds.includes(windowId);

  const windowRef = useRef<HTMLDivElement>(null);
  const windowInnerRef = useRef<HTMLDivElement>(null);
  const windowDepthOverlayRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef<boolean>(false);
  const prefersReducedMotionRef = useWindowMotionPreference(reduceMotion);

  const { contextSafe } = useGSAP({ scope: windowRef });
  const [isAnimatingMinimize, setIsAnimatingMinimize] = useState(false);

  const isAnimating =
    isAnimatingMinimize || isRestoring || isOpening || isCloseRequested;

  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState(() => ({
    position: appWindow.position ?? {
      x: WINDOW_LAYOUT.menubarOffsetY + 100,
      y: 100,
    },
    size: appWindow.size ?? {
      width: APP_WINDOW_DEFAULT_SIZE.width,
      height: APP_WINDOW_DEFAULT_SIZE.height,
    },
  }));

  const AppComponent = componentMap[appWindow.component];
  const isMinimizeDisabled =
    appWindow.component === "Projects" || appWindow.component === "Contact";

  const dragResizeProps = useWindowDragResize({
    appWindow,
    windowId,
    isMobile,
    isMaximized,
    isMinimized,
    isAnimating,
    focusWindow,
    setWindowPosition,
    setWindowSize,
  });

  const { position, size, handleTitleBarMouseDown, handleResizeMouseDown } =
    dragResizeProps;

  const { toggleMaximize, handleMinimize, handleClose } = useWindowActions({
    windowId,
    windowRef,
    isMobile,
    isMaximized,
    setIsMaximized,
    preMaximizeState,
    setPreMaximizeState,
    contextSafe: contextSafe as <T extends (...args: never[]) => unknown>(
      func: T,
    ) => T,
    isMinimized,
    isAnimatingMinimize,
    setIsAnimatingMinimize,
    isRestoring,
    isMinimizeDisabled,
    prefersReducedMotionRef:
      prefersReducedMotionRef as React.MutableRefObject<boolean>,
    isClosingRef,
    dragResizeProps: {
      position: dragResizeProps.position,
      size: dragResizeProps.size,
      positionRef: dragResizeProps.positionRef,
      sizeRef: dragResizeProps.sizeRef,
      setDraftPosition: dragResizeProps.setDraftPosition,
      setDraftSize: dragResizeProps.setDraftSize,
      stopInteractions: dragResizeProps.stopInteractions,
    },
    actions: {
      setWindowPosition,
      setWindowSize,
      closeWindow,
      minimizeWindow,
      playSwitchOn,
      playSwitchOff,
      playMinimizeWindow,
      playCloseWindow,
    },
  });

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

      const dockTarget = getDockTarget(windowId);
      if (!dockTarget) {
        finishOpenWindow(windowId);
        return;
      }
      const targetEl = dockTarget.el as HTMLElement;

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
      const skewX = calculateWindowSkew(fromCenterX, targetCenterX);

      Flip.fit(windowEl, targetEl, { duration: 0, scale: true });
      dockTarget.cleanup?.();
      gsap.set(windowEl, { opacity: 0, skewX });

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
          playSwoosh();
          finishOpenWindow(windowId);
        },
      });
    },
    { scope: windowRef, dependencies: [finishOpenWindow, windowId] },
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

      const dockTarget = getDockTarget(windowId);
      if (!dockTarget) {
        finishRestoreWindow(windowId);
        return;
      }
      const targetEl = dockTarget.el as HTMLElement;

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
      const skewX = calculateWindowSkew(fromCenterX, targetCenterX);

      Flip.fit(windowEl, targetEl, { duration: 0, scale: true });
      dockTarget.cleanup?.();
      gsap.set(windowEl, { opacity: 0, skewX });

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
    { scope: windowRef, dependencies: [finishRestoreWindow, windowId] },
  );

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

  const titleBarClass = isDarkMode
    ? isActive
      ? "bg-gray-800"
      : "bg-gray-900"
    : isActive
      ? "bg-gray-200"
      : "bg-gray-100";

  const contentBgClass = isDarkMode ? "bg-gray-900" : "bg-white";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";
  const isEffectivelyMaximized = isMaximized || isMobile;

  return (
    <WindowFrame
      windowRef={windowRef}
      windowInnerRef={windowInnerRef}
      windowDepthOverlayRef={windowDepthOverlayRef}
      titleBarClass={titleBarClass}
      contentBgClass={contentBgClass}
      textClass={textClass}
      title={appWindow.title}
      isMobile={isMobile}
      isMinimized={isMinimized}
      isAnimating={isAnimating}
      isEffectivelyMaximized={isEffectivelyMaximized}
      position={position}
      size={size}
      zIndex={isAnimating ? 80 : isActive ? 30 : 20}
      pointerEvents={isMinimized || isAnimating ? "none" : "auto"}
      onWindowMouseDown={() => {
        if (isMinimized || isAnimating) return;
        focusWindow(windowId);
      }}
      onTitleBarMouseDown={handleTitleBarMouseDown}
      onResizeMouseDown={handleResizeMouseDown}
      onClose={handleClose}
      onMinimize={handleMinimize}
      onMaximize={toggleMaximize}
      isMinimizeDisabled={isMinimizeDisabled}
    >
      {AppComponent ? (
        <AppComponent
          isDarkMode={isDarkMode}
          project={appWindow.data ?? null}
        />
      ) : (
        <div className="p-4">Content not available</div>
      )}
    </WindowFrame>
  );
}
