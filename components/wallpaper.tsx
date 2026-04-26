"use client";

import { useEffect, useState } from "react";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
import { useSettingsStore } from "@/store/useSettingsStore";
import { WALLPAPERS } from "@/constants/appearance-config";

const isDataUri = (src: string) => src.startsWith("data:");

function WallpaperLayer({ src, visible }: { src: string; visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {isDataUri(src) ? (
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${src}")` }}
        />
      ) : (
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url("${src}")` }}
        />
      )}
    </div>
  );
}

export default function Wallpaper() {
  const { isDarkMode } = useIsDarkMode();

  // Settings state
  const wallpaperId = useSettingsStore((state) => state.wallpaperId);

  const wallpaper = WALLPAPERS.find((w) => w.id === wallpaperId);
  const imageUrl = isDarkMode ? wallpaper?.darkSrc : wallpaper?.lightSrc;

  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    let canceled = false;
    let startRafId: number | null = null;
    let fadeRafId: number | null = null;
    let timeoutId: number | null = null;
    let preloadImage: HTMLImageElement | null = null;

    const beginTransition = () => {
      if (canceled || !imageUrl) return;

      startRafId = window.requestAnimationFrame(() => {
        setNextUrl(imageUrl);

        fadeRafId = window.requestAnimationFrame(() => {
          setTransitioning(true);
        });

        timeoutId = window.setTimeout(() => {
          setCurrentUrl(imageUrl);
          setNextUrl(null);
          setTransitioning(false);
        }, 700);
      });
    };

    if (!imageUrl) {
      const resetRafId = window.requestAnimationFrame(() => {
        setCurrentUrl(null);
        setNextUrl(null);
        setTransitioning(false);
      });

      return () => {
        window.cancelAnimationFrame(resetRafId);
      };
    }

    if (!currentUrl) {
      const initRafId = window.requestAnimationFrame(() => {
        setCurrentUrl(imageUrl);
      });

      return () => {
        window.cancelAnimationFrame(initRafId);
      };
    }

    if (currentUrl === imageUrl) {
      return;
    }

    if (isDataUri(imageUrl)) {
      beginTransition();
    } else {
      preloadImage = new window.Image();
      preloadImage.src = imageUrl;

      if (preloadImage.complete) {
        beginTransition();
      } else {
        preloadImage.onload = () => {
          beginTransition();
        };
      }
    }

    return () => {
      canceled = true;

      if (preloadImage) {
        preloadImage.onload = null;
      }

      if (typeof startRafId === "number") {
        window.cancelAnimationFrame(startRafId);
      }

      if (typeof fadeRafId === "number") {
        window.cancelAnimationFrame(fadeRafId);
      }

      if (typeof timeoutId === "number") {
        window.clearTimeout(timeoutId);
      }
    };
  }, [imageUrl, currentUrl]);

  if (!imageUrl && !currentUrl) {
    return <div className="absolute inset-0 -z-50 bg-black overflow-hidden" />;
  }

  const baseUrl = currentUrl ?? imageUrl;

  return (
    <div className="absolute inset-0 -z-50 bg-black overflow-hidden">
      {baseUrl ? (
        // 👈 السر هنا: جعلنا visible دائماً true لكي لا تختفي الصورة القديمة
        <WallpaperLayer src={baseUrl} visible={true} />
      ) : null}
      {nextUrl ? (
        // 👈 الصورة الجديدة ستظهر بنعومة "فوق" القديمة وتغطيها
        <WallpaperLayer src={nextUrl} visible={transitioning} />
      ) : null}
    </div>
  );
}
