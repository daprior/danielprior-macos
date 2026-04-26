"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AppWindow } from "@/types";
import {
  APP_WINDOW_DEFAULT_SIZE,
  WINDOW_LAYOUT,
} from "@/constants/window-config";
import { resizeWindow } from "@/lib/window/resize";

interface UseWindowDragResizeOptions {
  appWindow: AppWindow;
  windowId: string;
  isMobile: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  isAnimating: boolean;
  focusWindow: (windowId: string) => void;
  setWindowPosition: (
    windowId: string,
    position: { x: number; y: number },
  ) => void;
  setWindowSize: (
    windowId: string,
    size: { width: number; height: number },
  ) => void;
}

export const useWindowDragResize = ({
  appWindow,
  windowId,
  isMobile,
  isMaximized,
  isMinimized,
  isAnimating,
  focusWindow,
  setWindowPosition,
  setWindowSize,
}: UseWindowDragResizeOptions) => {
  const [draftPosition, setDraftPosition] = useState<
    AppWindow["position"] | null
  >(null);
  const [draftSize, setDraftSize] = useState<AppWindow["size"] | null>(null);

  const defaultPosition = useMemo(
    () => ({
      x: WINDOW_LAYOUT.menubarOffsetY + 100,
      y: 100,
    }),
    [],
  );

  const defaultSize = useMemo(
    () => ({
      width: APP_WINDOW_DEFAULT_SIZE.width,
      height: APP_WINDOW_DEFAULT_SIZE.height,
    }),
    [],
  );

  const position = useMemo(
    () => draftPosition ?? appWindow.position ?? defaultPosition,
    [draftPosition, appWindow.position, defaultPosition],
  );

  const size = useMemo(
    () => draftSize ?? appWindow.size ?? defaultSize,
    [draftSize, appWindow.size, defaultSize],
  );

  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setDraftPosition({
          x: event.clientX - dragOffset.x,
          y: event.clientY - dragOffset.y,
        });
      } else if (isResizing && resizeDirection) {
        event.preventDefault();
        const dx = event.clientX - resizeStartPos.x;
        const dy = event.clientY - resizeStartPos.y;

        const { newSize, newPosition } = resizeWindow(
          resizeDirection,
          resizeStartSize,
          position,
          dx,
          dy,
        );

        setDraftSize(newSize);
        if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
          setDraftPosition(newPosition);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);

      setWindowPosition(windowId, positionRef.current);
      setWindowSize(windowId, sizeRef.current);

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
    dragOffset,
    isDragging,
    isResizing,
    position,
    resizeDirection,
    resizeStartPos,
    resizeStartSize,
    setWindowPosition,
    setWindowSize,
    windowId,
  ]);

  const handleTitleBarMouseDown = (event: React.MouseEvent) => {
    if (isMobile || isMaximized || isMinimized || isAnimating) return;
    if ((event.target as HTMLElement).closest(".window-controls")) return;

    setIsDragging(true);
    setDragOffset({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });

    focusWindow(windowId);
  };

  const handleResizeMouseDown = (
    event: React.MouseEvent,
    direction: string,
  ) => {
    if (isMobile || isMinimized || isAnimating) return;

    event.preventDefault();
    event.stopPropagation();

    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStartPos({ x: event.clientX, y: event.clientY });
    setResizeStartSize({ width: size.width, height: size.height });

    focusWindow(windowId);
  };

  const stopInteractions = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  return {
    position,
    size,
    positionRef,
    sizeRef,
    isDragging,
    isResizing,
    resizeDirection,
    setDraftPosition,
    setDraftSize,
    handleTitleBarMouseDown,
    handleResizeMouseDown,
    stopInteractions,
  };
};
