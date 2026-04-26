"use client";

import { Minus, X, ArrowRightIcon as ArrowsMaximize } from "lucide-react";

interface WindowControlsProps {
  isMinimizeDisabled: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

export function WindowControls({
  isMinimizeDisabled,
  onClose,
  onMinimize,
  onMaximize,
}: WindowControlsProps) {
  return (
    <div className="window-controls flex items-center space-x-2 mr-4">
      <button
        className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
        onClick={onClose}
      >
        <X className="w-2 h-2 text-red-800 opacity-0 hover:opacity-100" />
      </button>
      <button
        className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center"
        onClick={onMinimize}
        disabled={isMinimizeDisabled}
        aria-disabled={isMinimizeDisabled}
        title={isMinimizeDisabled ? "Minimize disabled" : "Minimize"}
        style={
          isMinimizeDisabled
            ? { opacity: 0.5, cursor: "not-allowed" }
            : undefined
        }
      >
        <Minus className="w-2 h-2 text-yellow-800 opacity-0 hover:opacity-100" />
      </button>
      <button
        className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center"
        onClick={onMaximize}
      >
        <ArrowsMaximize className="w-2 h-2 text-green-800 opacity-0 hover:opacity-100" />
      </button>
    </div>
  );
}
