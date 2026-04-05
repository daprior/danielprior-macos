"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { INITIAL_SNAKE, SNAKE_CONFIG } from "@/constants/game-config";
import { STORAGE_KEYS } from "@/constants/storage-keys";

interface SnakeProps {
  isDarkMode?: boolean;
}

// Define types for game elements
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export default function Snake({ isDarkMode = true }: SnakeProps) {
  const GRID_SIZE = SNAKE_CONFIG.gridSize;
  const CELL_SIZE = SNAKE_CONFIG.cellSize;
  const GAME_SPEED = SNAKE_CONFIG.gameSpeed;

  // Game state
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("UP");
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === "undefined") return 0;
    const savedHighScore = window.localStorage.getItem(
      STORAGE_KEYS.snakeHighScore,
    );
    return savedHighScore ? Number.parseInt(savedHighScore, 10) : 0;
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  // Colors based on dark mode
  const bgColor = isDarkMode ? "#1a1a1a" : "#f0f0f0";
  const gridColor = isDarkMode ? "#333333" : "#e0e0e0";
  const snakeColor = isDarkMode ? "#4ade80" : "#22c55e"; // Green
  const foodColor = isDarkMode ? "#f87171" : "#ef4444"; // Red
  const textColor = isDarkMode ? "#ffffff" : "#000000";

  // Generate random food position
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

  // Draw game on canvas
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.fillStyle = gridColor;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Draw snake
    ctx.fillStyle = snakeColor;
    snake.forEach((segment) => {
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE,
      );
    });

    // Draw food
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    const centerX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = food.y * CELL_SIZE + CELL_SIZE / 2;
    ctx.arc(centerX, centerY, CELL_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Draw score
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

    // Draw game over text
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
    snakeColor,
    foodColor,
    textColor,
    CELL_SIZE,
    GRID_SIZE,
  ]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (isPaused || gameOver) return;

    // Move snake
    const head = { ...snake[0] };
    switch (direction) {
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

    // Check for collisions with walls
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      setGameOver(true);
      return;
    }

    // Check for collisions with self
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    // Check if snake eats food
    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore((prevScore) => prevScore + 10);
      setHighScore((prevHighScore) => Math.max(prevHighScore, score + 10));
    } else {
      newSnake.pop(); // Remove tail if no food eaten
    }

    setSnake(newSnake);
  }, [
    direction,
    food,
    gameOver,
    generateFood,
    isPaused,
    score,
    snake,
    GRID_SIZE,
  ]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ": // Space bar to pause/resume
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameOver]);

  // Start/stop game loop
  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(gameLoop, GAME_SPEED);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPaused, gameOver, gameLoop, GAME_SPEED]);

  // Draw game whenever state changes
  useEffect(() => {
    drawGame();
  }, [snake, food, gameOver, score, drawGame]);

  // Save high score to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.snakeHighScore, highScore.toString());
  }, [highScore]);

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection("UP");
    setGameOver(false);
    setScore(0);
    setIsPaused(true);
  };

  // Handle direction button clicks
  const handleDirectionClick = (newDirection: Direction) => {
    // Prevent 180-degree turns
    if (
      (newDirection === "UP" && direction !== "DOWN") ||
      (newDirection === "DOWN" && direction !== "UP") ||
      (newDirection === "LEFT" && direction !== "RIGHT") ||
      (newDirection === "RIGHT" && direction !== "LEFT")
    ) {
      setDirection(newDirection);
    }
  };

  return (
    <div
      className={`h-full flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} p-4`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Snake Game</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
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

      {/* Mobile controls */}
      <div className="mt-4 grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
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
        <p>Use arrow keys to move, space to pause/resume</p>
      </div>
    </div>
  );
}
