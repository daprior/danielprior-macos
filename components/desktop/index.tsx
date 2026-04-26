"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Dock from "@/components/dock";
import Menubar from "@/components/menubar";
import Wallpaper from "@/components/wallpaper";
import Window from "@/components/window";
import Launchpad from "@/components/launchpad";
import ControlCenter from "@/components/control-center";
import ContactFolder from "@/components/contact-folder";
import Spotlight from "@/components/spotlight";
import SystemNotifications from "@/components/system-notifications";
import QuickContactWidget from "@/components/quick-contact-widget";
import ProjectFolder from "@/components/project-folder";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSystemStore } from "@/store/useSystemStore";
import { useUISound } from "@/hooks/useUISounds";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
import { useIsMobile } from "@/hooks/use-mobile";
import { UI_MOBILE_BREAKPOINT } from "@/constants/ui-config";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { GitHubProjectSummary } from "@/types";
import type { DesktopPosition } from "@/types/components/desktop";
import {
  fallbackProjects,
  getInitialProjectPosition,
  type ProjectsApiResponse,
} from "./utils";

export default function Desktop() {
  const [time, setTime] = useState(new Date());
  const { playPop } = useUISound();
  const isMobile = useIsMobile();
  const [pulseContact, setPulseContact] = useState(false);

  // System state
  const desktopIntroNonce = useSystemStore((state) => state.desktopIntroNonce);
  const desktopIntroLastPlayedNonce = useSystemStore(
    (state) => state.desktopIntroLastPlayedNonce,
  );
  const markDesktopIntroPlayed = useSystemStore(
    (state) => state.markDesktopIntroPlayed,
  );

  // Desktop state
  const openWindows = useDesktopStore((state) => state.openWindows);
  const activeWindowId = useDesktopStore((state) => state.activeWindowId);
  const showLaunchpad = useDesktopStore((state) => state.showLaunchpad);
  const showControlCenter = useDesktopStore((state) => state.showControlCenter);
  const showSpotlight = useDesktopStore((state) => state.showSpotlight);
  const toggleSpotlight = useDesktopStore((state) => state.toggleSpotlight);
  const desktopBackgroundClick = useDesktopStore(
    (state) => state.desktopBackgroundClick,
  );
  const openApp = useDesktopStore((state) => state.openApp);
  const projectFolderPositions = useDesktopStore(
    (state) => state.projectFolderPositions,
  );
  const setProjectFolderPosition = useDesktopStore(
    (state) => state.setProjectFolderPosition,
  );
  const contactFolderPosition = useDesktopStore(
    (state) => state.contactFolderPosition,
  );
  const setContactFolderPosition = useDesktopStore(
    (state) => state.setContactFolderPosition,
  );

  // Settings state
  const screenBrightness = useSettingsStore((state) => state.screenBrightness);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  // Theme
  const { isDarkMode } = useIsDarkMode();

  // Notifications
  const pushNotification = useNotificationStore(
    (state) => state.pushNotification,
  );

  // Refs and other state
  const rootRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);
  const lastNotifiedIntroNonceRef = useRef(0);
  const [projects, setProjects] = useState<GitHubProjectSummary[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const visibleWindows = useMemo(() => {
    if (!isMobile) return openWindows;
    if (!openWindows.length) return [];

    const active = activeWindowId
      ? openWindows.find((w) => w.id === activeWindowId)
      : undefined;

    return [active ?? openWindows[openWindows.length - 1]].filter(Boolean);
  }, [activeWindowId, isMobile, openWindows]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // No default app opening to avoid duplicate key issues

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (desktopIntroNonce <= 0) return;
    if (lastNotifiedIntroNonceRef.current >= desktopIntroNonce) {
      return;
    }

    const notificationTimer = window.setTimeout(() => {
      lastNotifiedIntroNonceRef.current = desktopIntroNonce;
      pushNotification({
        appName: "Let's Talk",
        appIcon: "💬",
        title: "ready to chat?",
        message:
          " I'm here to answer your questions and discuss potential opportunities. Feel free to reach out!",
        action: {
          label: "Open",
          appId: "contact",
        },
      });
    }, 900);

    const pulseOnTimer = window.setTimeout(() => {
      setPulseContact(true);
    }, 650);

    const pulseOffTimer = window.setTimeout(() => {
      setPulseContact(false);
    }, 3600);

    return () => {
      window.clearTimeout(notificationTimer);
      window.clearTimeout(pulseOnTimer);
      window.clearTimeout(pulseOffTimer);
    };
  }, [desktopIntroNonce, pushNotification]);

  useEffect(() => {
    prefersReducedMotionRef.current =
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false) ||
      reduceMotion;
  }, [reduceMotion]);

  const fetchProjectsData = useCallback(async (): Promise<
    GitHubProjectSummary[]
  > => {
    try {
      const response = await fetch("/api/github/projects", {
        cache: "no-store",
      });
      const data = (await response.json()) as ProjectsApiResponse;

      if (response.ok && data.projects.length) {
        return data.projects;
      }
      return fallbackProjects();
    } catch {
      return fallbackProjects();
    }
  }, []);

  const loadProjects = useCallback(async () => {
    const nextProjects = await fetchProjectsData();
    setProjects(nextProjects);
    setProjectsLoaded(true);
  }, [fetchProjectsData]);

  useEffect(() => {
    let cancelled = false;

    const hydrateProjects = async () => {
      const nextProjects = await fetchProjectsData();
      if (cancelled) return;
      setProjects(nextProjects);
      setProjectsLoaded(true);
    };

    void hydrateProjects();

    return () => {
      cancelled = true;
    };
  }, [fetchProjectsData]);

  useEffect(() => {
    if (!projects.length) return;

    projects.forEach((project, index) => {
      if (!projectFolderPositions[project.id]) {
        setProjectFolderPosition(project.id, getInitialProjectPosition(index));
      }
    });
  }, [projectFolderPositions, projects, setProjectFolderPosition]);

  useGSAP(
    () => {
      const rootEl = rootRef.current;
      if (!rootEl) return;

      const shouldPlayIntro = desktopIntroNonce > desktopIntroLastPlayedNonce;

      if (prefersReducedMotionRef.current) {
        const menubarEl = rootEl.querySelector<HTMLElement>(
          '[data-role="menubar"]',
        );
        const dockSurfaceEl =
          rootEl.querySelector<HTMLElement>("[data-dock-root]");
        const windowEls = rootEl.querySelectorAll<HTMLElement>(
          '[data-role="window"]',
        );
        const windowInnerEls = rootEl.querySelectorAll<HTMLElement>(
          '[data-role="window-inner"]',
        );

        gsap.set(rootEl, { opacity: 1 });
        if (menubarEl) {
          const leftItems = menubarEl.querySelectorAll<HTMLElement>(
            "[data-menubar-left-item]",
          );
          const rightItems = menubarEl.querySelectorAll<HTMLElement>(
            "[data-menubar-right-item]",
          );

          gsap.set(menubarEl, { opacity: 1, "--menubar-blur": "20px" });
          if (leftItems.length) gsap.set(leftItems, { opacity: 1, y: 0 });
          if (rightItems.length) gsap.set(rightItems, { opacity: 1, y: 0 });
        }
        if (dockSurfaceEl) {
          const waveEls = dockSurfaceEl.querySelectorAll<HTMLElement>(
            "[data-dock-wave-id]",
          );
          gsap.set(dockSurfaceEl, { opacity: 1, "--dock-blur": "20px" });
          if (waveEls.length) gsap.set(waveEls, { opacity: 1, y: 0, scale: 1 });
        }
        if (windowEls.length) {
          gsap.set(windowEls, { opacity: 1, clearProps: "opacity" });
        }
        if (windowInnerEls.length) {
          // Don't clear transforms here; inner scale is used for window depth.
          gsap.set(windowInnerEls, { y: 0 });
        }

        if (shouldPlayIntro) {
          markDesktopIntroPlayed(desktopIntroNonce);
        }
        return;
      }

      if (!shouldPlayIntro) {
        const menubarEl = rootEl.querySelector<HTMLElement>(
          '[data-role="menubar"]',
        );
        const dockSurfaceEl =
          rootEl.querySelector<HTMLElement>("[data-dock-root]");
        const windowEls = rootEl.querySelectorAll<HTMLElement>(
          '[data-role="window"]',
        );
        const windowInnerEls = rootEl.querySelectorAll<HTMLElement>(
          '[data-role="window-inner"]',
        );

        gsap.set(rootEl, { opacity: 1 });

        if (menubarEl) {
          const leftItems = menubarEl.querySelectorAll<HTMLElement>(
            "[data-menubar-left-item]",
          );
          const rightItems = menubarEl.querySelectorAll<HTMLElement>(
            "[data-menubar-right-item]",
          );
          gsap.set(menubarEl, { opacity: 1, "--menubar-blur": "20px" });
          if (leftItems.length) gsap.set(leftItems, { opacity: 1, y: 0 });
          if (rightItems.length) gsap.set(rightItems, { opacity: 1, y: 0 });
        }

        if (dockSurfaceEl) {
          const waveEls = dockSurfaceEl.querySelectorAll<HTMLElement>(
            "[data-dock-wave-id]",
          );
          gsap.set(dockSurfaceEl, { opacity: 1, "--dock-blur": "20px" });
          if (waveEls.length) {
            gsap.set(waveEls, { opacity: 1, y: 0, scale: 1 });
          }
        }

        if (windowEls.length) {
          gsap.set(windowEls, { opacity: 1, clearProps: "opacity" });
        }
        if (windowInnerEls.length) {
          gsap.set(windowInnerEls, { y: 0 });
        }

        return;
      }

      const menubarEl = rootEl.querySelector<HTMLElement>(
        '[data-role="menubar"]',
      );
      const dockSurfaceEl =
        rootEl.querySelector<HTMLElement>("[data-dock-root]");
      const windowEls = Array.from(
        rootEl.querySelectorAll<HTMLElement>('[data-role="window"]'),
      );
      const windowInnerEls = Array.from(
        rootEl.querySelectorAll<HTMLElement>('[data-role="window-inner"]'),
      );

      // Ensure we're visible even after exit transitions.
      gsap.set(rootEl, { opacity: 1 });

      if (!menubarEl || !dockSurfaceEl) return;

      const isMobile = window.innerWidth < UI_MOBILE_BREAKPOINT;

      const leftItems = Array.from(
        menubarEl.querySelectorAll<HTMLElement>("[data-menubar-left-item]"),
      );
      const rightItems = Array.from(
        menubarEl.querySelectorAll<HTMLElement>("[data-menubar-right-item]"),
      );
      const rightItemsRtl = [...rightItems].reverse();

      const waveEls = Array.from(
        dockSurfaceEl.querySelectorAll<HTMLElement>("[data-dock-wave-id]"),
      );

      const visibleWindowEls = windowEls.filter(
        (el) => window.getComputedStyle(el).visibility !== "hidden",
      );
      const visibleWindowInnerEls = windowInnerEls.filter(
        (el) => window.getComputedStyle(el).visibility !== "hidden",
      );

      gsap.killTweensOf([
        menubarEl,
        ...leftItems,
        ...rightItems,
        dockSurfaceEl,
        ...waveEls,
        ...visibleWindowEls,
        ...visibleWindowInnerEls,
      ]);

      gsap.set(menubarEl, { opacity: 0, "--menubar-blur": "0px" });
      if (leftItems.length) gsap.set(leftItems, { opacity: 0, y: -6 });
      if (rightItems.length) gsap.set(rightItems, { opacity: 0, y: -6 });

      gsap.set(dockSurfaceEl, { opacity: 0, "--dock-blur": "0px" });

      if (waveEls.length) {
        gsap.set(waveEls, {
          opacity: 0,
          y: 12,
          scale: 0.96,
          transformOrigin: "bottom center",
        });
      }

      if (visibleWindowEls.length) {
        gsap.set(visibleWindowEls, { opacity: 0 });
      }
      if (visibleWindowInnerEls.length) {
        gsap.set(visibleWindowInnerEls, { y: 10 });
      }

      const timeline = gsap.timeline();

      // Menubar: blur reveal + stagger items (left→right, then right→left)
      timeline.to(
        menubarEl,
        {
          opacity: 1,
          duration: 0.18,
          ease: "power2.out",
          clearProps: "opacity",
        },
        0,
      );

      timeline.to(
        menubarEl,
        {
          duration: 0.32,
          ease: "power2.out",
          "--menubar-blur": "20px",
        },
        0,
      );

      if (leftItems.length) {
        timeline.to(
          leftItems,
          {
            opacity: 1,
            y: 0,
            duration: 0.18,
            ease: "power2.out",
            stagger: 0.05,
            clearProps: "opacity,transform",
          },
          0.04,
        );
      }

      if (rightItemsRtl.length) {
        timeline.to(
          rightItemsRtl,
          {
            opacity: 1,
            y: 0,
            duration: 0.18,
            ease: "power2.out",
            stagger: 0.04,
            clearProps: "opacity,transform",
          },
          0.08,
        );
      }

      // Dock: blur reveal + stagger pop (no scan streak)
      timeline.to(
        dockSurfaceEl,
        {
          opacity: 1,
          duration: 0.18,
          ease: "power2.out",
          clearProps: "opacity",
        },
        0.22,
      );

      timeline.to(
        dockSurfaceEl,
        {
          duration: 0.32,
          ease: "power2.out",
          "--dock-blur": "20px",
        },
        0.22,
      );

      if (waveEls.length) {
        timeline.to(
          waveEls,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isMobile ? 0.16 : 0.22,
            ease: "power2.out",
            stagger: isMobile ? 0.02 : 0.035,
            clearProps: "opacity,transform",
          },
          0.28,
        );
      }

      // Windows: enter last (after dock starts)
      const windowsStart = 0.62;

      if (visibleWindowEls.length) {
        timeline.to(
          visibleWindowEls,
          {
            opacity: 1,
            duration: 0.18,
            ease: "power2.out",
            stagger: 0.05,
            clearProps: "opacity",
          },
          windowsStart,
        );
      }

      if (visibleWindowInnerEls.length) {
        timeline.to(
          visibleWindowInnerEls,
          {
            y: 0,
            duration: 0.18,
            ease: "power2.out",
            stagger: 0.05,
          },
          windowsStart,
        );
      }

      timeline.call(() => {
        markDesktopIntroPlayed(desktopIntroNonce);
      });

      return () => {
        timeline.kill();
      };
    },
    {
      dependencies: [
        desktopIntroNonce,
        desktopIntroLastPlayedNonce,
        markDesktopIntroPlayed,
      ],
    },
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        toggleSpotlight();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSpotlight]);

  const handleDesktopClick = (e: React.MouseEvent) => {
    // Only handle clicks directly on the desktop, not on children
    if (e.target === desktopRef.current) {
      if (showControlCenter) {
        playPop();
      }
      setSelectedProjectId(null);
      desktopBackgroundClick();
    }
  };

  const handleOpenProject = (project: GitHubProjectSummary) => {
    setSelectedProjectId(project.id);
    const position =
      projectFolderPositions[project.id] ??
      getInitialProjectPosition(
        projects.findIndex((item) => item.id === project.id),
      );

    openApp({
      id: project.id,
      title: project.name,
      component: "Projects",
      position,
      size: {
        width: 920,
        height: 680,
      },
      data: project,
    });
  };

  const handleOpenContact = () => {
    openApp({
      id: "contact",
      title: "Let's Talk",
      component: "Contact",
      position: {
        x: 220,
        y: 120,
      },
      size: {
        width: 860,
        height: 620,
      },
    });
  };

  return (
    <div ref={rootRef} data-screen="desktop" className="relative">
      <div
        ref={desktopRef}
        className="relative h-[100dvh] w-screen overflow-hidden"
        onMouseDown={handleDesktopClick}
      >
        <Wallpaper />

        <Menubar time={time} />

        {/* Project folders */}
        {projectsLoaded ? (
          isMobile ? (
            <div
              className="absolute inset-0 z-10"
              style={{
                paddingTop: "calc(24px + env(safe-area-inset-top) + 12px)",
                paddingBottom: "calc(80px + env(safe-area-inset-bottom))",
              }}
            >
              <div className="h-full w-full overflow-auto">
                <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-4 px-4 py-4">
                  {projects.map((project) => (
                    <ProjectFolder
                      key={project.id}
                      variant="mobile"
                      project={project}
                      isDarkMode={isDarkMode}
                      isActive={
                        activeWindowId === project.id ||
                        (activeWindowId === null &&
                          selectedProjectId === project.id)
                      }
                      onSelect={() => setSelectedProjectId(project.id)}
                      onOpen={() => handleOpenProject(project)}
                      onRefreshMetadata={() => {
                        void loadProjects();
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 z-10 pt-6 pb-16">
              <ContactFolder
                isDarkMode={isDarkMode}
                isActive={activeWindowId === "contact"}
                position={contactFolderPosition ?? undefined}
                onOpen={handleOpenContact}
                onSelect={() => {}}
                onPositionChange={setContactFolderPosition}
              />
              {projects.map((project, index) => {
                const position =
                  projectFolderPositions[project.id] ??
                  getInitialProjectPosition(index);

                return (
                  <ProjectFolder
                    key={project.id}
                    project={project}
                    position={position}
                    isDarkMode={isDarkMode}
                    isActive={
                      activeWindowId === project.id ||
                      (activeWindowId === null &&
                        selectedProjectId === project.id)
                    }
                    onSelect={() => setSelectedProjectId(project.id)}
                    onOpen={() => handleOpenProject(project)}
                    onRefreshMetadata={() => {
                      void loadProjects();
                    }}
                    onPositionChange={(nextPosition: DesktopPosition) =>
                      setProjectFolderPosition(project.id, nextPosition)
                    }
                  />
                );
              })}
            </div>
          )
        ) : null}

        {/* Windows */}
        <div
          className={`absolute inset-0 pt-6 pb-16 ${
            openWindows.length > 0 ? "z-20" : "-z-10 hidden"
          }`}
        >
          {visibleWindows.map((window) => (
            <Window
              key={window.id}
              window={window}
              isActive={activeWindowId === window.id}
              windowId={window.id}
            />
          ))}
        </div>

        {/* Launchpad */}
        {showLaunchpad && <Launchpad />}

        {/* Control Center */}
        {showControlCenter && <ControlCenter />}

        {/* Spotlight */}
        {showSpotlight && <Spotlight />}

        <SystemNotifications />

        <QuickContactWidget />

        <Dock pulseContact={pulseContact} />
      </div>

      {/* Brightness overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  );
}
