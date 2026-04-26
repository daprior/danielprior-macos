export interface SnakeProps {
  isDarkMode?: boolean;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export type Position = { x: number; y: number };

type SnakeState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  queuedDirection: Direction;
  gameOver: boolean;
  isPaused: boolean;
  score: number;
  highScore: number;
  speedMs: number;
  didNotifyHighScore: boolean;
};

type SnakeActions = {
  queueDirection: (nextDirection: Direction) => void;
  setDirection: (direction: Direction) => void;
  setSnake: (snake: Position[]) => void;
  setFood: (food: Position) => void;
  setGameOver: (gameOver: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  togglePaused: () => void;
  setScore: (score: number) => void;
  setHighScore: (highScore: number) => void;
  setSpeedMs: (speedMs: number) => void;
  setDidNotifyHighScore: (didNotifyHighScore: boolean) => void;
  resetRun: (initialSpeed: number) => void;
};

export type SnakeStore = SnakeState & SnakeActions;
