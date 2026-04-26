"use client";

import type React from "react";
import { WindowControls } from "./window-controls";

interface WindowFrameProps {
  windowRef: React.RefObject<HTMLDivElement | null>;
  windowInnerRef: React.RefObject<HTMLDivElement | null>;
  windowDepthOverlayRef: React.RefObject<HTMLDivElement | null>;
  titleBarClass: string;
  contentBgClass: string;
  textClass: string;
  title: string;
  isMobile: boolean;
  isMinimized: boolean;
  isAnimating: boolean;
  isEffectivelyMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  pointerEvents: "none" | "auto";
  onWindowMouseDown: () => void;
  onTitleBarMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onResizeMouseDown: (
    event: React.MouseEvent<HTMLDivElement>,
    direction: string,
  ) => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMinimizeDisabled: boolean;
  children: React.ReactNode;
}

export function WindowFrame({
  windowRef,
  windowInnerRef,
  windowDepthOverlayRef,
  titleBarClass,
  contentBgClass,
  textClass,
  title,
  isMobile,
  isMinimized,
  isAnimating,
  isEffectivelyMaximized,
  position,
  size,
  zIndex,
  pointerEvents,
  onWindowMouseDown,
  onTitleBarMouseDown,
  onResizeMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  isMinimizeDisabled,
  children,
}: WindowFrameProps) {
  return (
    <div
      ref={windowRef}
      data-role="window"
      className={`${isMobile ? "fixed" : "absolute"} rounded-lg overflow-hidden shadow-2xl transition-shadow`}
      style={{
        ...(isMobile
          ? {
              left: 0,
              right: 0,
              top: `calc(26px + env(safe-area-inset-top))`,
              bottom: `calc(64px + env(safe-area-inset-bottom))`,
            }
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }),
        zIndex,
        pointerEvents,
      }}
      onMouseDown={onWindowMouseDown}
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

        <div
          className={`h-8 flex items-center px-3 ${titleBarClass}`}
          onMouseDown={onTitleBarMouseDown}
        >
          <WindowControls
            isMinimizeDisabled={isMinimizeDisabled}
            onClose={onClose}
            onMinimize={onMinimize}
            onMaximize={onMaximize}
          />

          <div
            className={`flex-1 text-center text-sm font-medium truncate ${textClass}`}
          >
            {title}
          </div>

          <div className="w-16">{/* Spacer to balance the title */}</div>
        </div>

        <div className={`${contentBgClass} h-[calc(100%-2rem)] overflow-auto`}>
          {children}
        </div>

        {!isEffectivelyMaximized && !isMinimized && !isAnimating && (
          <>
            <div
              className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-20"
              onMouseDown={(event) => onResizeMouseDown(event, "nw")}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-20"
              onMouseDown={(event) => onResizeMouseDown(event, "ne")}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-20"
              onMouseDown={(event) => onResizeMouseDown(event, "sw")}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20"
              onMouseDown={(event) => onResizeMouseDown(event, "se")}
            />

            <div
              className="absolute top-0 left-4 right-4 h-2 cursor-n-resize z-20"
              onMouseDown={(event) => onResizeMouseDown(event, "n")}
            />
            <div
              className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-20"
              onMouseDown={(event) => onResizeMouseDown(event, "s")}
            />
            <div
              className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize z-20"
              onMouseDown={(event) => onResizeMouseDown(event, "w")}
            />
            <div
              className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize z-20"
              onMouseDown={(event) => onResizeMouseDown(event, "e")}
            />
          </>
        )}
      </div>
    </div>
  );
}
