"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { YOUTUBE_CHANNEL_URL } from "@/constants/media-links";

interface YouTubeProps {
  isDarkMode?: boolean;
}

export default function YouTube({ isDarkMode = true }: YouTubeProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const hasOpenedRef = useRef(false);

  // Open YouTube channel when the app is opened
  useEffect(() => {
    // Only open once
    if (!hasOpenedRef.current) {
      hasOpenedRef.current = true;

      // Open in new tab
      window.open(YOUTUBE_CHANNEL_URL, "_blank");
    }
  }, []);

  return (
    <div
      className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}
    >
      <div className="text-center">
        <Image
          src="/youtube.png"
          alt="YouTube"
          width={64}
          height={64}
          className="mx-auto mb-4 object-contain"
          quality={85}
          loading="eager"
        />
        <h2 className="text-xl font-semibold mb-2">Opening YouTube...</h2>
        <p>Redirecting to your YouTube channel</p>
      </div>
    </div>
  );
}
