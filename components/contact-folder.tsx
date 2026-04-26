"use client";

import Image from "next/image";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useEffect, useRef, useState } from "react";
import type React from "react";
import type { DesktopPosition } from "@/types/components/desktop";

interface ContactFolderProps {
  variant?: "desktop" | "mobile";
  isDarkMode?: boolean;
  isActive?: boolean;
  position?: DesktopPosition;
  onOpen: () => void;
  onSelect?: () => void;
  onPositionChange?: (position: DesktopPosition) => void;
}

export default function ContactFolder({
  variant = "desktop",
  isDarkMode = true,
  isActive = false,
  position,
  onOpen,
  onSelect,
  onPositionChange,
}: ContactFolderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const rootRef = useRef<HTMLButtonElement>(null);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const handlersRef = useRef({ onPositionChange, onSelect });

  const posX = position?.x;
  const posY = position?.y;

  useEffect(() => {
    handlersRef.current = { onPositionChange, onSelect };
  }, [onPositionChange, onSelect]);

  useEffect(() => {
    if (variant !== "desktop") return;
    gsap.registerPlugin(Draggable);

    const element = rootRef.current;
    if (!element) return;

    const [draggable] = Draggable.create(element, {
      type: "x,y",
      dragClickables: true,
      onPress() {
        handlersRef.current.onSelect?.();
        suppressClickRef.current = false;
      },
      onDragStart() {
        draggingRef.current = true;
        suppressClickRef.current = true;
        setIsDragging(true);
      },
      onDrag() {
        handlersRef.current.onPositionChange?.({ x: this.x, y: this.y });
      },
      onDragEnd() {
        draggingRef.current = false;
        setIsDragging(false);
        handlersRef.current.onPositionChange?.({ x: this.x, y: this.y });
      },
      onRelease() {
        if (!draggingRef.current) {
          setIsDragging(false);
        }
      },
    });

    return () => {
      draggable.kill();
    };
  }, [variant]);

  useEffect(() => {
    if (variant !== "desktop") return;
    const element = rootRef.current;
    if (!element || draggingRef.current) return;
    if (typeof posX !== "number" || typeof posY !== "number") return;

    gsap.set(element, {
      x: posX,
      y: posY,
      force3D: true,
    });
  }, [posX, posY, variant]);

  const handleSingleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
      return;
    }

    if (variant === "mobile") {
      onOpen();
      return;
    }

    onSelect?.();
  };

  return (
    <button
      ref={rootRef}
      type="button"
      className={`${variant === "desktop" ? "absolute" : "relative"} select-none text-center ${
        variant === "desktop"
          ? "touch-none cursor-grab active:cursor-grabbing"
          : "touch-manipulation cursor-pointer"
      }`}
      style={
        variant === "desktop" && !position
          ? {
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: isActive ? 4 : 2,
            }
          : variant === "desktop"
            ? {
                zIndex: isActive ? 4 : 2,
              }
            : undefined
      }
      onClick={handleSingleClick}
      onDoubleClick={() => {
        if (!suppressClickRef.current) {
          onOpen();
        }
      }}
    >
      <div className="w-28 sm:w-32">
        <div
          className={`relative mx-auto h-20 w-20 transition-transform duration-150 sm:h-24 sm:w-24 ${
            isActive || isDragging ? "scale-105" : "scale-100"
          }`}
        >
          <Image
            src="/macos-folderl.svg"
            alt="Contact folder"
            fill
            sizes="96px"
            className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.32)]"
            priority={false}
          />

          <div className="absolute inset-x-3 top-6 h-8 overflow-hidden rounded-md bg-gradient-to-br from-blue-500/85 via-cyan-500/80 to-sky-400/75 sm:inset-x-4 sm:top-7 sm:h-9" />
        </div>

        <div className="mt-2 space-y-1 px-1">
          <p
            className={`truncate rounded-md px-2 py-1 text-xs font-medium leading-tight text-white ${
              isActive || isDragging ? "bg-blue-500/75" : "bg-black/35"
            }`}
          >
            Let&apos;s Talk
          </p>

          <p
            className={`mx-auto flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
              isDarkMode
                ? "bg-white/15 text-white/85"
                : "bg-black/10 text-gray-700"
            }`}
          >
            Book a call
          </p>
        </div>
      </div>
    </button>
  );
}
