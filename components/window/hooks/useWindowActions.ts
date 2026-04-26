import { useCallback } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import {
  getAvailableWindowSpace,
  calculateWindowSkew,
} from "@/lib/window/resize";
import { getDockTarget } from "@/lib/window/dock";
import type { UseWindowActionsProps } from "@/types/components/window";

gsap.registerPlugin(Flip);

export const useWindowActions = ({
  windowId,
  windowRef,
  isMobile,
  isMaximized,
  setIsMaximized,
  preMaximizeState,
  setPreMaximizeState,
  contextSafe,
  isMinimized,
  isAnimatingMinimize,
  setIsAnimatingMinimize,
  isRestoring,
  isMinimizeDisabled,
  prefersReducedMotionRef,
  isClosingRef,
  dragResizeProps,
  actions,
}: UseWindowActionsProps) => {
  const {
    position,
    size,
    positionRef,
    sizeRef,
    setDraftPosition,
    setDraftSize,
    stopInteractions,
  } = dragResizeProps;

  const {
    setWindowPosition,
    setWindowSize,
    closeWindow,
    minimizeWindow,
    playSwitchOn,
    playSwitchOff,
    playMinimizeWindow,
    playCloseWindow,
  } = actions;

  const toggleMaximize = useCallback(() => {
    if (isMobile) return;

    if (isMaximized) {
      playSwitchOff();
      positionRef.current = preMaximizeState.position;
      sizeRef.current = preMaximizeState.size;
      setDraftPosition(preMaximizeState.position);
      setDraftSize(preMaximizeState.size);
      setWindowPosition(windowId, preMaximizeState.position);
      setWindowSize(windowId, preMaximizeState.size);
    } else {
      playSwitchOn();
      setPreMaximizeState({ position, size });

      const nextSize = getAvailableWindowSpace();
      const nextPosition = { x: 0, y: 26 };

      positionRef.current = nextPosition;
      sizeRef.current = nextSize;
      setDraftPosition(nextPosition);
      setDraftSize(nextSize);
      setWindowPosition(windowId, nextPosition);
      setWindowSize(windowId, nextSize);
    }

    setDraftPosition(null);
    setDraftSize(null);
    setIsMaximized(!isMaximized);
  }, [
    isMobile,
    isMaximized,
    windowId,
    preMaximizeState,
    position,
    size,
    playSwitchOn,
    playSwitchOff,
    setIsMaximized,
    setWindowPosition,
    setWindowSize,
    positionRef,
    sizeRef,
    setDraftPosition,
    setDraftSize,
    setPreMaximizeState,
  ]);

  const handleMinimize = useCallback(() => {
    const minimizeAction = () => {
      if (
        isMinimizeDisabled ||
        isMinimized ||
        isAnimatingMinimize ||
        isRestoring
      )
        return;

      stopInteractions();
      playMinimizeWindow();

      const windowEl = windowRef.current;
      if (!windowEl || prefersReducedMotionRef.current) {
        minimizeWindow(windowId);
        return;
      }

      const dockTarget = getDockTarget(windowId);
      if (!dockTarget) {
        minimizeWindow(windowId);
        return;
      }

      const targetEl = dockTarget.el as HTMLElement;
      gsap.killTweensOf(windowEl);
      Flip.killFlipsOf(windowEl);
      setIsAnimatingMinimize(true);

      const fromRect = windowEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const fromCenterX = fromRect.left + fromRect.width / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const skewX = calculateWindowSkew(fromCenterX, targetCenterX);

      gsap.set(windowEl, {
        visibility: "visible",
        pointerEvents: "none",
        transformOrigin: "bottom center",
        willChange: "transform, opacity",
      });

      const fromState = Flip.getState(windowEl, { props: "opacity" });
      Flip.fit(windowEl, targetEl, { duration: 0, scale: true });
      dockTarget.cleanup?.();

      gsap.set(windowEl, { opacity: 0, skewX });

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
    };

    contextSafe(minimizeAction)();
  }, [
    windowId,
    contextSafe,
    isMinimized,
    isAnimatingMinimize,
    isRestoring,
    isMinimizeDisabled,
    playMinimizeWindow,
    minimizeWindow,
    windowRef,
    prefersReducedMotionRef,
    stopInteractions,
    setIsAnimatingMinimize,
  ]);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    if (isMinimized) {
      playCloseWindow();
      closeWindow(windowId);
      return;
    }

    const closeAction = () => {
      if (isClosingRef.current) return;
      isClosingRef.current = true;
      stopInteractions();

      const windowEl = windowRef.current;
      if (!windowEl || prefersReducedMotionRef.current) {
        playCloseWindow();
        closeWindow(windowId);
        return;
      }

      playCloseWindow();
      const dockTarget = getDockTarget(windowId);
      if (!dockTarget) {
        closeWindow(windowId);
        return;
      }

      const targetEl = dockTarget.el as HTMLElement;
      gsap.killTweensOf(windowEl);
      Flip.killFlipsOf(windowEl);

      const fromRect = windowEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const fromCenterX = fromRect.left + fromRect.width / 2;
      const targetCenterX = targetRect.left + targetRect.width / 2;
      const skewX = calculateWindowSkew(fromCenterX, targetCenterX);

      gsap.set(windowEl, {
        visibility: "visible",
        pointerEvents: "none",
        transformOrigin: "bottom center",
        willChange: "transform, opacity",
      });

      const fromState = Flip.getState(windowEl, { props: "opacity" });
      Flip.fit(windowEl, targetEl, { duration: 0, scale: true });
      dockTarget.cleanup?.();

      gsap.set(windowEl, { opacity: 0, skewX });

      Flip.from(fromState, {
        duration: 0.54,
        ease: "power3.inOut",
        scale: true,
        clearProps: false,
        onComplete: () => closeWindow(windowId),
      });
    };

    contextSafe(closeAction)();
  }, [
    windowId,
    contextSafe,
    isMinimized,
    playCloseWindow,
    closeWindow,
    windowRef,
    prefersReducedMotionRef,
    stopInteractions,
    isClosingRef,
  ]);

  return { toggleMaximize, handleMinimize, handleClose };
};
