export const WINDOW_MIN_SIZE = {
  width: 300,
  height: 200,
} as const;

export const APP_WINDOW_DEFAULT_SIZE = {
  width: 800,
  height: 600,
} as const;

export const APP_WINDOW_POSITION_RANGE = {
  xMin: 100,
  xMax: 300,
  yMin: 50,
  yMax: 150,
} as const;

export const WINDOW_LAYOUT = {
  menubarOffsetY: 26,
  dockReservedHeight: 70,
} as const;

export const ANIMATION_DELAYS_MS = {
  launchpadClose: 300,
  safariRefresh: 1000,
  bootSequence: 800,
} as const;
