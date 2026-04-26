"use client";

import { Github } from "lucide-react";
import { useEffect, useRef } from "react";

interface GitHubProps {
  isDarkMode?: boolean;
}

export default function GitHub({ isDarkMode = true }: GitHubProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white";
  const hasOpenedRef = useRef(false);

  // Redirect to GitHub profile
  useEffect(() => {
    // Only open once
    if (!hasOpenedRef.current) {
      hasOpenedRef.current = true;

      // Open GitHub profile in new tab
      window.open("https://github.com/maenababneh", "_blank");
    }
  }, []);

  return (
    <div
      className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}
    >
      <div className="text-center">
        <Github className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Opening GitHub...</h2>
        <p>Redirecting to your GitHub profile</p>
      </div>
    </div>
  );
}
