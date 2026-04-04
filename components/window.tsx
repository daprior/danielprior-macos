"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { X, Minus, ArrowRightIcon as ArrowsMaximize } from "lucide-react";
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
import { WINDOW_MIN_SIZE } from "@/constant/window-config";

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
  onClose: () => void;
  onFocus: () => void;
  isDarkMode: boolean;
}

export default function Window({
  window: appWindow,
  isActive,
  onClose,
  onFocus,
  isDarkMode,
}: WindowProps) {
  const [position, setPosition] = useState(appWindow.position);
  const [size, setSize] = useState(appWindow.size);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizeState, setPreMaximizeState] = useState({ position, size });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({
    width: 0,
    height: 0,
  });

  const windowRef = useRef<HTMLDivElement>(null);

  const AppComponent = componentMap[appWindow.component];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
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

        setSize({ width: newWidth, height: newHeight });
        if (resizeDirection.includes("w") || resizeDirection.includes("n")) {
          setPosition({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
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
  ]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;

    // Prevent dragging when clicking on buttons
    if ((e.target as HTMLElement).closest(".window-controls")) {
      return;
    }

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });

    onFocus();
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
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

    onFocus();
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      // Restore previous state
      setPosition(preMaximizeState.position);
      setSize(preMaximizeState.size);
    } else {
      // Save current state before maximizing
      setPreMaximizeState({ position, size });

      // Get the available space (accounting for menubar)
      const availableHeight = window.innerHeight - 26; // 6px for menubar + 20px padding

      // Maximize
      setPosition({ x: 0, y: 26 }); // Position below menubar
      setSize({
        width: window.innerWidth,
        height: availableHeight - 70, // Account for dock
      });
    }

    setIsMaximized(!isMaximized);
  };

  // Make minimize do the same as close
  const handleMinimize = () => {
    onClose();
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
      className={`absolute rounded-lg overflow-hidden shadow-2xl transition-shadow ${isActive ? "shadow-2xl z-10" : "shadow-lg z-0"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseDown={onFocus}
    >
      {/* Title bar */}
      <div
        className={`h-8 flex items-center px-3 ${titleBarClass}`}
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="window-controls flex items-center space-x-2 mr-4">
          <button
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
            onClick={onClose}
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
      {!isMaximized && (
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
  );
}
