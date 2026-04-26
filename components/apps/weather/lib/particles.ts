import type { WeatherCondition } from "@/constants/weather-data";
import type { Particle } from "@/types/apps/weather";

export const initParticles = (
  targetCondition: WeatherCondition,
  isDarkMode: boolean,
): Particle[] => {
  const particles: Particle[] = [];

  const count =
    targetCondition === "rainy"
      ? 90
      : targetCondition === "snowy"
        ? 72
        : targetCondition === "sunny"
          ? 42
          : 20;

  for (let i = 0; i < count; i++) {
    let particle: Particle;

    if (targetCondition === "rainy") {
      particle = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.45 - 0.225,
        speedY: Math.random() * 3.6 + 4.8,
        opacity: Math.random() * 0.4 + 0.45,
        color: isDarkMode
          ? "rgba(120, 160, 255, 0.8)"
          : "rgba(0, 90, 190, 0.6)",
      };
    } else if (targetCondition === "snowy") {
      particle = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 2,
        speedX: Math.random() * 0.55 - 0.275,
        speedY: Math.random() * 0.8 + 0.65,
        opacity: Math.random() * 0.3 + 0.7,
        color: "rgba(255, 255, 255, 0.8)",
        drift: Math.random() * 0.75 + 0.25,
      };
    } else if (targetCondition === "sunny") {
      particle = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.22,
        speedY: (Math.random() - 0.5) * 0.22,
        opacity: Math.random() * 0.5 + 0.3,
        color: isDarkMode
          ? `rgba(${255}, ${200 + Math.random() * 55}, ${0}, ${Math.random() * 0.5 + 0.3})`
          : `rgba(${255}, ${200 + Math.random() * 55}, ${0}, ${Math.random() * 0.7 + 0.3})`,
      };
    } else {
      // Clouds
      particle = {
        x: Math.random() * 100,
        y: Math.random() * 35 + 8,
        size: Math.random() * 26 + 24,
        speedX: Math.random() * 0.065 + 0.02,
        speedY: 0,
        opacity: Math.random() * 0.2 + 0.18,
        color: isDarkMode
          ? "rgba(200, 200, 220, 0.3)"
          : "rgba(255, 255, 255, 0.7)",
      };
    }

    particles.push(particle);
  }

  return particles;
};

export const updateParticles = (
  particles: Particle[],
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  condition: WeatherCondition,
) => {
  particles.forEach((p) => {
    const x = (p.x / 100) * width;
    const y = (p.y / 100) * height;

    ctx.beginPath();

    if (condition === "rainy") {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size / 2;
      ctx.lineCap = "round";
      ctx.moveTo(x, y);
      ctx.lineTo(x + p.speedX * 1.25, y + p.size * 3.2);
      ctx.stroke();
    } else if (condition === "snowy") {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(1, p.size * 0.22);
      ctx.beginPath();
      ctx.moveTo(x - p.size, y);
      ctx.lineTo(x + p.size, y);
      ctx.moveTo(x, y - p.size);
      ctx.lineTo(x, y + p.size);
      ctx.moveTo(x - p.size * 0.72, y - p.size * 0.72);
      ctx.lineTo(x + p.size * 0.72, y + p.size * 0.72);
      ctx.moveTo(x - p.size * 0.72, y + p.size * 0.72);
      ctx.lineTo(x + p.size * 0.72, y - p.size * 0.72);
      ctx.stroke();
    } else if (condition === "sunny") {
      ctx.fillStyle = p.color;
      ctx.shadowColor = "rgba(255, 200, 80, 0.55)";
      ctx.shadowBlur = p.size * 2.2;
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(
        x,
        y + p.size * 0.12,
        p.size * 0.9,
        p.size * 0.55,
        0,
        0,
        Math.PI * 2,
      );
      ctx.ellipse(
        x - p.size * 0.5,
        y,
        p.size * 0.48,
        p.size * 0.42,
        0,
        0,
        Math.PI * 2,
      );
      ctx.ellipse(
        x + p.size * 0.52,
        y - p.size * 0.05,
        p.size * 0.52,
        p.size * 0.44,
        0,
        0,
        Math.PI * 2,
      );
      ctx.ellipse(
        x,
        y - p.size * 0.28,
        p.size * 0.55,
        p.size * 0.48,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    p.x += p.speedX * 0.07;
    p.y += p.speedY * 0.07;

    if (condition === "rainy") {
      if (p.y > 100) {
        p.y = 0;
        p.x = Math.random() * 100;
      }
      if (p.x < 0 || p.x > 100) {
        p.x = Math.random() * 100;
      }
    } else if (condition === "snowy") {
      p.x += Math.sin((p.y + p.size) * 0.06) * (p.drift ?? 0.3) * 0.03;
      if (p.y > 100) {
        p.y = 0;
        p.x = Math.random() * 100;
      }
      if (p.x < 0 || p.x > 100) {
        p.x = Math.random() * 100;
      }
    } else if (condition === "sunny") {
      if (p.x < 0) p.x = 100;
      if (p.x > 100) p.x = 0;
      if (p.y < 0) p.y = 100;
      if (p.y > 100) p.y = 0;
    } else {
      if (p.x < -45) p.x = 140;
      if (p.x > 140) p.x = -45;
    }
  });
};
