import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { INITIAL_SNAKE } from "@/constants/game-config";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { noopStorage } from "@/store/noop-storage";
import { SnakeStore, Position } from "@/types/apps/snake";
import { createSelectors } from "./createSelectors";

const initialFood: Position = { x: 5, y: 5 };

export const useSnakeStore = create<SnakeStore>()(
  persist(
    (set, get) => ({
      snake: INITIAL_SNAKE,
      food: initialFood,
      direction: "UP",
      queuedDirection: "UP",
      gameOver: false,
      isPaused: true,
      score: 0,
      highScore: 0,
      speedMs: 100,
      didNotifyHighScore: false,

      queueDirection: (queuedDirection) => set({ queuedDirection }),
      setDirection: (direction) => set({ direction }),
      setSnake: (snake) => set({ snake }),
      setFood: (food) => set({ food }),
      setGameOver: (gameOver) => set({ gameOver }),
      setPaused: (isPaused) => set({ isPaused }),
      togglePaused: () => set({ isPaused: !get().isPaused }),
      setScore: (score) => set({ score }),
      setHighScore: (highScore) => set({ highScore }),
      setSpeedMs: (speedMs) => set({ speedMs }),
      setDidNotifyHighScore: (didNotifyHighScore) =>
        set({ didNotifyHighScore }),

      resetRun: (initialSpeed) =>
        set({
          snake: INITIAL_SNAKE,
          food: initialFood,
          direction: "UP",
          queuedDirection: "UP",
          gameOver: false,
          isPaused: true,
          score: 0,
          speedMs: initialSpeed,
          didNotifyHighScore: false,
        }),
    }),
    {
      name: STORAGE_KEYS.snakeState,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({
        highScore: state.highScore,
      }),
    },
  ),
);

export const useSnakeStoreSelectors = createSelectors(useSnakeStore);
