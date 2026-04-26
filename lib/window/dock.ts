import { WINDOW_LAYOUT } from "@/constants/window-config";
import type { DockTarget } from "@/types/components/window";

export const getDockTargetRect = (windowId: string): DOMRect | null => {
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
};

export const getDockTarget = (windowId: string): DockTarget | null => {
  if (typeof document === "undefined") return null;

  const iconEl = document.querySelector<HTMLElement>(
    `[data-dock-app-id="${windowId}"]`,
  );
  if (iconEl) return { el: iconEl, cleanup: undefined };

  const rect = getDockTargetRect(windowId);
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
};
