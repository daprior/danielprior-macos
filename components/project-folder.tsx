"use client";

import Image from "next/image";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Github, Link2, RefreshCw, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import type { DesktopPosition } from "@/types/components/desktop";
import type { GitHubProjectSummary } from "@/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectFolderProps {
  project: GitHubProjectSummary;
  position?: DesktopPosition;
  variant?: "desktop" | "mobile";
  isDarkMode?: boolean;
  isActive?: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onRefreshMetadata?: () => void;
  onPositionChange?: (position: DesktopPosition) => void;
}

export default function ProjectFolder({
  project,
  position,
  variant = "desktop",
  isDarkMode = true,
  isActive = false,
  onSelect,
  onOpen,
  onRefreshMetadata,
  onPositionChange,
}: ProjectFolderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [coverStatus, setCoverStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >(project.coverImageUrl ? "loading" : "idle");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const rootRef = useRef<HTMLButtonElement>(null);
  const draggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const handlersRef = useRef({ onPositionChange, onSelect });

  const posX = position?.x;
  const posY = position?.y;

  const updatedAgo = useMemo(() => {
    const updatedAtDate = new Date(project.updatedAt);
    if (Number.isNaN(updatedAtDate.getTime())) {
      return "Unknown update time";
    }
    return `${formatDistanceToNow(updatedAtDate)} ago`;
  }, [project.updatedAt]);

  useEffect(() => {
    handlersRef.current = { onPositionChange, onSelect };
  }, [onPositionChange, onSelect]);

  useEffect(() => {
    setCoverStatus(project.coverImageUrl ? "loading" : "idle");
  }, [project.coverImageUrl]);

  useEffect(() => {
    if (variant !== "desktop") return;
    gsap.registerPlugin(Draggable);

    const element = rootRef.current;
    if (!element) return;

    const [draggable] = Draggable.create(element, {
      type: "x,y",
      dragClickables: true,
      onPress() {
        handlersRef.current.onSelect();
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

    onSelect();
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
      return;
    }

    onOpen();
  };

  const handleOpenInGitHub = () => {
    window.open(project.url, "_blank", "noopener,noreferrer");
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(project.url);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    window.setTimeout(() => {
      setCopyState("idle");
    }, 1200);
  };

  return (
    <ContextMenu>
      <TooltipProvider delayDuration={250}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ContextMenuTrigger asChild>
              <button
                ref={rootRef}
                type="button"
                className={`${
                  variant === "desktop" ? "absolute" : "relative"
                } select-none text-center ${
                  variant === "desktop"
                    ? isDragging
                      ? "touch-none cursor-grabbing"
                      : "touch-none cursor-grab"
                    : "touch-manipulation cursor-pointer"
                }`}
                style={{
                  zIndex: isDragging ? 40 : isActive ? 4 : 2,
                }}
                onClick={handleSingleClick}
                onDoubleClick={
                  variant === "desktop" ? handleDoubleClick : undefined
                }
              >
                <div className="w-28 sm:w-32">
                  <div
                    className={`relative mx-auto h-20 w-20 transition-transform duration-150 sm:h-24 sm:w-24 ${
                      isActive ? "scale-105" : "scale-100"
                    }`}
                  >
                    <Image
                      src="/macos-folderl.svg"
                      alt="Project folder"
                      fill
                      sizes="96px"
                      className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.32)]"
                      priority={false}
                    />

                    {project.coverImageUrl ? (
                      <div className="absolute inset-x-3 top-6 h-8 overflow-hidden rounded-md sm:inset-x-4 sm:top-7 sm:h-9">
                        {coverStatus !== "error" ? (
                          <Image
                            src={project.coverImageUrl}
                            alt={project.name}
                            fill
                            sizes="64px"
                            className={`object-cover transition-opacity duration-300 ${
                              coverStatus === "loaded"
                                ? "opacity-80"
                                : "opacity-0"
                            }`}
                            onLoad={() => setCoverStatus("loaded")}
                            onError={() => setCoverStatus("error")}
                          />
                        ) : null}

                        {coverStatus === "loading" ? (
                          <div className="absolute inset-0 animate-pulse bg-white/30" />
                        ) : null}

                        {coverStatus === "error" ? (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-700/80 to-blue-500/80" />
                        ) : null}
                      </div>
                    ) : (
                      <div className="absolute inset-x-3 top-6 h-8 overflow-hidden rounded-md bg-gradient-to-br from-slate-900/80 via-slate-700/80 to-blue-500/80 sm:inset-x-4 sm:top-7 sm:h-9" />
                    )}
                  </div>

                  <div className="mt-2 space-y-1 px-1">
                    <p
                      className={`truncate rounded-md px-2 py-1 text-xs font-medium leading-tight text-white ${
                        isActive ? "bg-blue-500/75" : "bg-black/35"
                      }`}
                    >
                      {project.name}
                    </p>

                    <p
                      className={`mx-auto flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
                        isDarkMode
                          ? "bg-black/35 text-white/85"
                          : "bg-white/80 text-gray-700"
                      }`}
                    >
                      <Github className="h-3 w-3" />
                      <Star className="h-3 w-3" />
                      {project.stargazerCount}
                    </p>
                  </div>
                </div>
              </button>
            </ContextMenuTrigger>
          </TooltipTrigger>

          <TooltipContent
            side="top"
            align="center"
            className="max-w-xs space-y-1 border-white/20 bg-black/85 text-white shadow-xl"
          >
            <p className="font-semibold leading-tight">
              {project.nameWithOwner}
            </p>
            <p className="line-clamp-2 text-xs text-white/80">
              {project.description ?? "No description available"}
            </p>
            <p className="text-[11px] text-white/70">
              Language: {project.primaryLanguage?.name ?? "Unknown"}
            </p>
            <p className="text-[11px] text-white/70">Updated: {updatedAgo}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ContextMenuContent className="w-56">
        <ContextMenuLabel className="text-xs text-muted-foreground">
          {project.nameWithOwner}
        </ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onOpen}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open
        </ContextMenuItem>
        <ContextMenuItem onClick={handleOpenInGitHub}>
          <Github className="mr-2 h-4 w-4" />
          Open in GitHub
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCopyUrl}>
          <Link2 className="mr-2 h-4 w-4" />
          {copyState === "copied"
            ? "Copied URL"
            : copyState === "failed"
              ? "Copy failed"
              : "Copy URL"}
        </ContextMenuItem>
        <ContextMenuItem disabled>
          <Star className="mr-2 h-4 w-4" />
          Star Count: {project.stargazerCount}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => {
            onRefreshMetadata?.();
          }}
          disabled={!onRefreshMetadata}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh metadata
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
