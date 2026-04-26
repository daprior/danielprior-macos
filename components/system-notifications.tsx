"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Bell, X } from "lucide-react";
import { useDesktopStore } from "@/store/useDesktopStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function SystemNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const dismissNotification = useNotificationStore(
    (state) => state.dismissNotification,
  );
  const openApp = useDesktopStore((state) => state.openApp);
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);
  const { isDarkMode } = useIsDarkMode();
  const rootRef = useRef<HTMLDivElement>(null);

  const openContactApp = () => {
    openApp({
      id: "contact",
      title: "Let's Talk",
      component: "Contact",
      position: { x: 220, y: 120 },
      size: { width: 860, height: 620 },
    });
  };

  useEffect(() => {
    if (!notifications.length) return;

    if (reduceMotion) return;

    const cards = rootRef.current?.querySelectorAll<HTMLElement>(
      "[data-notification-id]",
    );
    if (!cards?.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: -10, x: 12, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
        stagger: 0.05,
      },
    );
  }, [notifications, reduceMotion]);

  useEffect(() => {
    const timers = notifications.map((notification) =>
      window.setTimeout(() => dismissNotification(notification.id), 4600),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [notifications, dismissNotification]);

  if (!notifications.length) return null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed right-4 top-10 z-[70] flex w-[320px] flex-col gap-2"
      aria-live="polite"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          data-notification-id={notification.id}
          className={`pointer-events-auto rounded-xl border p-3 shadow-2xl backdrop-blur-xl ${
            isDarkMode
              ? "border-white/10 bg-zinc-900/85 text-zinc-100"
              : "border-zinc-200 bg-white/90 text-zinc-900"
          }`}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-2.5">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border text-sm ${
                  isDarkMode
                    ? "border-white/10 bg-zinc-800/80"
                    : "border-zinc-300 bg-zinc-100"
                }`}
                aria-hidden="true"
              >
                {notification.appIcon ?? <Bell className="h-4 w-4" />}
              </div>

              <div className="min-w-0">
                <div className="mb-0.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] opacity-70">
                  <span className="truncate">{notification.appName}</span>
                  <span className="text-[10px] normal-case">now</span>
                </div>
                <p className="truncate text-sm font-semibold leading-tight">
                  {notification.title}
                </p>
                <p className="mt-0.5 text-xs opacity-90">
                  {notification.message}
                </p>
                {notification.action ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (notification.action?.appId === "contact") {
                        openContactApp();
                      }
                      dismissNotification(notification.id);
                    }}
                    className="mt-2 rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white transition hover:bg-blue-400"
                  >
                    {notification.action.label}
                  </button>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismissNotification(notification.id)}
              className="rounded p-1 opacity-70 transition hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
