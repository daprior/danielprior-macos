import { WINDOW_MIN_SIZE } from "@/constants/window-config";
import type { WindowPosition, WindowSize } from "@/types/components/window";

export const resizeWindow = (
  resizeDirection: string | null,
  resizeStartSize: WindowSize,
  currentPosition: WindowPosition,
  dx: number,
  dy: number,
): { newSize: WindowSize; newPosition: WindowPosition } => {
  let newWidth = resizeStartSize.width;
  let newHeight = resizeStartSize.height;
  let newX = currentPosition.x;
  let newY = currentPosition.y;

  const minWidth = WINDOW_MIN_SIZE.width;
  const minHeight = WINDOW_MIN_SIZE.height;

  if (resizeDirection?.includes("e")) {
    newWidth = Math.max(minWidth, resizeStartSize.width + dx);
  }
  if (resizeDirection?.includes("s")) {
    newHeight = Math.max(minHeight, resizeStartSize.height + dy);
  }
  if (resizeDirection?.includes("w")) {
    const proposedWidth = resizeStartSize.width - dx;
    if (proposedWidth >= minWidth) {
      newWidth = proposedWidth;
      newX = currentPosition.x + dx;
    }
  }
  if (resizeDirection?.includes("n")) {
    const proposedHeight = resizeStartSize.height - dy;
    if (proposedHeight >= minHeight) {
      newHeight = proposedHeight;
      newY = currentPosition.y + dy;
    }
  }

  return {
    newSize: { width: newWidth, height: newHeight },
    newPosition: { x: newX, y: newY },
  };
};

export const getAvailableWindowSpace = () => {
  const availableHeight = window.innerHeight - 26;
  return {
    width: window.innerWidth,
    height: availableHeight - 70,
  };
};

export const calculateWindowSkew = (
  fromCenterX: number,
  targetCenterX: number,
): number => {
  const deltaX = targetCenterX - fromCenterX;
  return Math.max(
    -12,
    Math.min(12, (deltaX / Math.max(1, window.innerWidth)) * 28),
  );
};
