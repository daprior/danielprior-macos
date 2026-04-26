export type GridPosition = {
  x: number;
  y: number;
};

export const SNAKE_CONFIG = {
  gridSize: 20,
  cellSize: 20,
  gameSpeed: 100,
  minGameSpeed: 58,
  speedStep: 6,
  pointsPerLevel: 50,
  bodyInset: 2,
} as const;

export const INITIAL_SNAKE: GridPosition[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
