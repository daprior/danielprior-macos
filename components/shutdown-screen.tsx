"use client";

import { useEffect, useState } from "react";
import { AppleIcon } from "@/components/icons";
import { useSystemStore } from "@/store/useSystemStore";

export default function ShutdownScreen() {
  const boot = useSystemStore((s) => s.boot);
  const [showBootText, setShowBootText] = useState(false);

  useEffect(() => {
    // Show the "Click to boot" text after a delay
    const timer = setTimeout(() => {
      setShowBootText(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-screen w-screen bg-black flex flex-col items-center justify-center cursor-pointer"
      onMouseDown={boot}
    >
      {showBootText ? (
        <div className="flex flex-col items-center">
          <AppleIcon className="w-20 h-20 text-white mb-8" />
          <p className="text-white text-lg animate-pulse">Click to boot</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-white text-lg mb-4">
            Your computer has been shut down
          </p>
          <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
