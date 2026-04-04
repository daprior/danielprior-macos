"use client";

import { useEffect, useState } from "react";
import { AppleIcon } from "@/components/icons";

interface SleepScreenProps {
  onWakeUp: () => void;
}

export default function SleepScreen({ onWakeUp }: SleepScreenProps) {
  const [showWakeText, setShowWakeText] = useState(false);

  useEffect(() => {
    // Show the "Click to wake up" text after a delay
    const timer = setTimeout(() => {
      setShowWakeText(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-screen w-screen bg-black flex flex-col items-center justify-center cursor-pointer"
      onMouseDown={onWakeUp}
    >
      <AppleIcon className="w-20 h-20 text-white mb-8 opacity-30" />

      {showWakeText && (
        <p className="text-white text-lg opacity-50 animate-pulse">
          Click to wake up
        </p>
      )}
    </div>
  );
}
