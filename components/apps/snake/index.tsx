"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Play,
  RotateCcw,
  Pause,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SNAKE_CONFIG } from "@/constants/game-config";
import { useSnakeStore } from "@/store/useSnakeStore";
import { useUISound } from "@/hooks/useUISounds";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import type { SnakeProps, Position, Direction } from "@/types/apps/snake";
import {
  drawRoundedRect,
  FOOD_BURST_PARTICLES,
  isOppositeDirection,
  SCORE_PER_FOOD,
  wrapPosition,
} from "./utils";

export default function Snake({ isDarkMode = true }: SnakeProps) {
  const GRID_SIZE = SNAKE_CONFIG.gridSize;
  const CELL_SIZE = SNAKE_CONFIG.cellSize;
  const INITIAL_SPEED = SNAKE_CONFIG.gameSpeed;
  const MIN_SPEED = SNAKE_CONFIG.minGameSpeed;
  const SPEED_STEP = SNAKE_CONFIG.speedStep;
  const POINTS_PER_LEVEL = SNAKE_CONFIG.pointsPerLevel;
  const BODY_INSET = SNAKE_CONFIG.bodyInset;

  // Snake state
  const snake = useSnakeStore((state) => state.snake);
  const food = useSnakeStore((state) => state.food);
  const direction = useSnakeStore((state) => state.direction);
  const queuedDirection = useSnakeStore((state) => state.queuedDirection);
  const gameOver = useSnakeStore((state) => state.gameOver);
  const isPaused = useSnakeStore((state) => state.isPaused);
  const score = useSnakeStore((state) => state.score);
  const highScore = useSnakeStore((state) => state.highScore);
  const speedMs = useSnakeStore((state) => state.speedMs);
  const didNotifyHighScore = useSnakeStore((state) => state.didNotifyHighScore);
  const queueDirection = useSnakeStore((state) => state.queueDirection);
  const setDirection = useSnakeStore((state) => state.setDirection);
  const setSnake = useSnakeStore((state) => state.setSnake);
  const setFood = useSnakeStore((state) => state.setFood);
  const setGameOver = useSnakeStore((state) => state.setGameOver);
  const setPaused = useSnakeStore((state) => state.setPaused);
  const togglePaused = useSnakeStore((state) => state.togglePaused);
  const setScore = useSnakeStore((state) => state.setScore);
  const setHighScore = useSnakeStore((state) => state.setHighScore);
  const setSpeedMs = useSnakeStore((state) => state.setSpeedMs);
  const setDidNotifyHighScore = useSnakeStore(
    (state) => state.setDidNotifyHighScore,
  );
  const resetRun = useSnakeStore((state) => state.resetRun);

  // Settings state
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  // Notifications
  const pushNotification = useNotificationStore(
    (state) => state.pushNotification,
  );

  // Sounds
  const { playPop, playError } = useUISound();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const accumulatorRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const activeParticlesRef = useRef<HTMLDivElement[]>([]);
  const prefersReducedMotionRef = useRef(false);

  const bgColor = isDarkMode ? "#1a1a1a" : "#f0f0f0";
  const gridColor = isDarkMode ? "#333333" : "#e0e0e0";
  const foodColor = isDarkMode ? "#f87171" : "#ef4444";
  const textColor = isDarkMode ? "#ffffff" : "#000000";

  const snakePalette = useMemo(
    () => ({
      headFill: isDarkMode ? "#86efac" : "#16a34a",
      headStroke: isDarkMode ? "#22c55e" : "#14532d",
      bodyStart: isDarkMode ? "#4ade80" : "#22c55e",
      bodyEnd: isDarkMode ? "#16a34a" : "#166534",
      eye: isDarkMode ? "#0f172a" : "#dcfce7",
    }),
    [isDarkMode],
  );

  useEffect(() => {
    prefersReducedMotionRef.current =
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ??
        false) ||
      reduceMotion;
  }, [reduceMotion]);

  useGSAP(
    () => {
      if (!rootRef.current || prefersReducedMotionRef.current) return;

      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 10, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.22,
          ease: "power2.out",
          clearProps: "opacity,transform",
        },
      );
    },
    { dependencies: [] },
  );

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y,
      )
    );

    return newFood;
  }, [snake, GRID_SIZE]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = gridColor;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    const gradient = ctx.createLinearGradient(0, 0, CELL_SIZE, CELL_SIZE);
    gradient.addColorStop(0, snakePalette.bodyStart);
    gradient.addColorStop(1, snakePalette.bodyEnd);

    snake.forEach((segment, index) => {
      const x = segment.x * CELL_SIZE + BODY_INSET;
      const y = segment.y * CELL_SIZE + BODY_INSET;
      const size = CELL_SIZE - BODY_INSET * 2;
      const radius = Math.max(3, Math.floor(size * 0.28));

      drawRoundedRect(ctx, x, y, size, size, radius);
      ctx.fillStyle = index === 0 ? snakePalette.headFill : gradient;
      ctx.fill();
      ctx.strokeStyle =
        index === 0 ? snakePalette.headStroke : "rgba(0, 0, 0, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (index === 0) {
        const eyeSize = Math.max(2, Math.floor(CELL_SIZE * 0.11));
        const eyeY = segment.y * CELL_SIZE + CELL_SIZE * 0.35;
        const leftEyeX = segment.x * CELL_SIZE + CELL_SIZE * 0.35;
        const rightEyeX = segment.x * CELL_SIZE + CELL_SIZE * 0.65;
        ctx.fillStyle = snakePalette.eye;
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, eyeSize, 0, 2 * Math.PI);
        ctx.arc(rightEyeX, eyeY, eyeSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    const foodRadius = CELL_SIZE * 0.38;
    ctx.beginPath();
    const centerX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = food.y * CELL_SIZE + CELL_SIZE / 2;

    const foodGradient = ctx.createRadialGradient(
      centerX - foodRadius * 0.3,
      centerY - foodRadius * 0.4,
      foodRadius * 0.2,
      centerX,
      centerY,
      foodRadius,
    );
    foodGradient.addColorStop(0, isDarkMode ? "#fda4af" : "#fb7185");
    foodGradient.addColorStop(1, foodColor);

    ctx.fillStyle = foodGradient;
    ctx.arc(centerX, centerY, foodRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.arc(
      centerX - foodRadius * 0.28,
      centerY - foodRadius * 0.32,
      foodRadius * 0.25,
      0,
      2 * Math.PI,
    );
    ctx.fill();

    ctx.strokeStyle = isDarkMode ? "#166534" : "#15803d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - foodRadius - 2);
    ctx.lineTo(centerX + 2, centerY - foodRadius - 8);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);
    ctx.textAlign = "right";
    ctx.fillText(
      `High Score: ${highScore}`,
      canvas.width - 10,
      canvas.height - 10,
    );

    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = "18px Arial";
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillText(
        "Press Restart to play again",
        canvas.width / 2,
        canvas.height / 2 + 40,
      );
    }
  }, [
    snake,
    food,
    gameOver,
    score,
    highScore,
    bgColor,
    gridColor,
    snakePalette,
    foodColor,
    textColor,
    BODY_INSET,
    CELL_SIZE,
    GRID_SIZE,
    isDarkMode,
  ]);

  const cleanupParticles = useCallback(() => {
    if (activeParticlesRef.current.length === 0) return;
    gsap.killTweensOf(activeParticlesRef.current);
    activeParticlesRef.current.forEach((particle) => particle.remove());
    activeParticlesRef.current = [];
  }, []);

  const createFoodBurst = useCallback(
    (foodPosition: Position) => {
      if (prefersReducedMotionRef.current) return;

      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas) return;

      const rootRect = root.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const centerX =
        canvasRect.left -
        rootRect.left +
        foodPosition.x * CELL_SIZE +
        CELL_SIZE / 2;
      const centerY =
        canvasRect.top -
        rootRect.top +
        foodPosition.y * CELL_SIZE +
        CELL_SIZE / 2;

      for (let index = 0; index < FOOD_BURST_PARTICLES; index += 1) {
        const angle = (Math.PI * 2 * index) / FOOD_BURST_PARTICLES;
        const distance = 22 + Math.random() * 18;
        const particle = document.createElement("div");
        particle.className =
          "absolute h-1.5 w-1.5 rounded-full pointer-events-none";
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        particle.style.backgroundColor = foodColor;
        particle.style.boxShadow = `0 0 8px ${foodColor}`;
        particle.style.transform = "translate(-50%, -50%)";

        root.appendChild(particle);
        activeParticlesRef.current.push(particle);

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          scale: 0.15,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => {
            particle.remove();
            activeParticlesRef.current = activeParticlesRef.current.filter(
              (item) => item !== particle,
            );
          },
        });
      }
    },
    [CELL_SIZE, foodColor],
  );

  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    const nextDirection = queuedDirection;
    setDirection(nextDirection);

    const head = { ...snake[0] };
    switch (nextDirection) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    head.x = wrapPosition(head.x, GRID_SIZE);
    head.y = wrapPosition(head.y, GRID_SIZE);

    const didEatFood = head.x === food.x && head.y === food.y;
    const bodyToCheck = didEatFood ? snake : snake.slice(0, -1);
    if (
      bodyToCheck.some(
        (segment) => segment.x === head.x && segment.y === head.y,
      )
    ) {
      setGameOver(true);
      playError();
      if (!prefersReducedMotionRef.current && canvasRef.current) {
        gsap.fromTo(
          canvasRef.current,
          { x: -4 },
          {
            x: 4,
            repeat: 5,
            yoyo: true,
            duration: 0.04,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(canvasRef.current, { x: 0 });
            },
          },
        );
      }
      return;
    }

    const newSnake = [head, ...snake];
    if (didEatFood) {
      const nextScore = score + SCORE_PER_FOOD;
      createFoodBurst(food);
      setFood(generateFood());
      setScore(nextScore);

      const level = Math.floor(nextScore / POINTS_PER_LEVEL);
      const nextSpeed = Math.max(INITIAL_SPEED - level * SPEED_STEP, MIN_SPEED);
      setSpeedMs(nextSpeed);

      if (!prefersReducedMotionRef.current && canvasRef.current) {
        gsap.fromTo(
          canvasRef.current,
          { scale: 1 },
          {
            scale: 1.03,
            duration: 0.08,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          },
        );
      }

      playPop();

      if (nextScore > highScore) {
        setHighScore(nextScore);
        if (!didNotifyHighScore) {
          setDidNotifyHighScore(true);
          pushNotification({
            appName: "Snake",
            appIcon: "🐍",
            title: "New High Score!",
            message: `${nextScore} points`,
          });
        }
      }
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [
    didNotifyHighScore,
    food,
    gameOver,
    generateFood,
    highScore,
    INITIAL_SPEED,
    isPaused,
    MIN_SPEED,
    createFoodBurst,
    playError,
    playPop,
    POINTS_PER_LEVEL,
    pushNotification,
    queuedDirection,
    score,
    setDidNotifyHighScore,
    setDirection,
    setFood,
    setGameOver,
    setHighScore,
    setScore,
    snake,
    setSnake,
    setSpeedMs,
    SPEED_STEP,
    GRID_SIZE,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (!isOppositeDirection(direction, "UP")) queueDirection("UP");
          break;
        case "ArrowDown":
          if (!isOppositeDirection(direction, "DOWN")) queueDirection("DOWN");
          break;
        case "ArrowLeft":
          if (!isOppositeDirection(direction, "LEFT")) queueDirection("LEFT");
          break;
        case "ArrowRight":
          if (!isOppositeDirection(direction, "RIGHT")) queueDirection("RIGHT");
          break;
        case " ":
          togglePaused();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameOver, queueDirection, togglePaused]);

  useEffect(() => {
    const runFrame = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      if (!isPaused && !gameOver) {
        accumulatorRef.current += elapsed;

        while (accumulatorRef.current >= speedMs) {
          gameLoop();
          accumulatorRef.current -= speedMs;
        }
      }

      animationFrameRef.current = window.requestAnimationFrame(runFrame);
    };

    animationFrameRef.current = window.requestAnimationFrame(runFrame);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = null;
      lastFrameTimeRef.current = null;
      accumulatorRef.current = 0;
    };
  }, [isPaused, gameOver, gameLoop, speedMs]);

  useEffect(() => {
    return () => {
      cleanupParticles();
    };
  }, [cleanupParticles]);

  useEffect(() => {
    drawGame();
  }, [snake, food, gameOver, score, drawGame]);

  const resetGame = () => {
    resetRun(INITIAL_SPEED);
    accumulatorRef.current = 0;
    lastFrameTimeRef.current = null;
    cleanupParticles();
    setFood(generateFood());
    if (!prefersReducedMotionRef.current && controlsRef.current) {
      gsap.fromTo(
        controlsRef.current,
        { y: 0 },
        {
          y: -5,
          duration: 0.08,
          repeat: 1,
          yoyo: true,
          ease: "power1.out",
        },
      );
    }
  };

  const handleDirectionClick = (newDirection: Direction) => {
    if (!isOppositeDirection(direction, newDirection)) {
      queueDirection(newDirection);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`relative h-full overflow-hidden flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} p-4`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Snake Game</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaused(!isPaused)}
            disabled={gameOver}
            className={isDarkMode ? "border-gray-700" : ""}
          >
            {isPaused ? (
              <Play className="w-4 h-4 mr-1" />
            ) : (
              <Pause className="w-4 h-4 mr-1" />
            )}
            {isPaused ? "Play" : "Pause"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetGame}
            className={isDarkMode ? "border-gray-700" : ""}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Restart
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border border-gray-600 rounded-md shadow-lg"
        />
      </div>

      <div
        ref={controlsRef}
        className="mt-4 grid grid-cols-3 gap-2 max-w-[200px] mx-auto"
      >
        <div className="col-start-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full aspect-square"
            onClick={() => handleDirectionClick("UP")}
            disabled={gameOver}
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
        </div>
        <div className="col-start-1 row-start-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full aspect-square"
            onClick={() => handleDirectionClick("LEFT")}
            disabled={gameOver}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
        <div className="col-start-3 row-start-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full aspect-square"
            onClick={() => handleDirectionClick("RIGHT")}
            disabled={gameOver}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="col-start-2 row-start-2">
          <div className="w-full aspect-square"></div>
        </div>
        <div className="col-start-2 row-start-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full aspect-square"
            onClick={() => handleDirectionClick("DOWN")}
            disabled={gameOver}
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="mt-4 text-center text-sm">
        <p>
          Use arrow keys to move, space to pause/resume. Speed increases every{" "}
          {POINTS_PER_LEVEL} points.
        </p>
      </div>
    </div>
  );
}
