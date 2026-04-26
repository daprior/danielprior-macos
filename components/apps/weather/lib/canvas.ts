import type { WeatherCondition } from "@/constants/weather-data";

export const NIGHT_STARS = [
  { x: 0.08, y: 0.08, size: 1.4 },
  { x: 0.14, y: 0.15, size: 1.2 },
  { x: 0.22, y: 0.07, size: 1.8 },
  { x: 0.28, y: 0.17, size: 1.3 },
  { x: 0.34, y: 0.1, size: 1.5 },
  { x: 0.42, y: 0.18, size: 1.1 },
  { x: 0.5, y: 0.08, size: 1.6 },
  { x: 0.58, y: 0.16, size: 1.2 },
  { x: 0.66, y: 0.09, size: 1.4 },
  { x: 0.74, y: 0.17, size: 1.2 },
  { x: 0.82, y: 0.07, size: 1.7 },
  { x: 0.9, y: 0.14, size: 1.3 },
];

export const drawSunOrMoon = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dayProgress: number,
  targetCondition: WeatherCondition,
  rotationDeg: number,
  scale: number,
) => {
  const clampedProgress = Math.min(1, Math.max(0, dayProgress));
  const sunAlpha = clampedProgress;
  const moonAlpha = 1 - clampedProgress;

  const centerX = width * 0.16 + moonAlpha * width * 0.02;
  const centerY = height * 0.2;

  if (sunAlpha > 0.02) {
    ctx.save();
    ctx.globalAlpha = sunAlpha;
    ctx.translate(centerX, centerY);
    ctx.rotate((rotationDeg * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    const sunRadius =
      targetCondition === "sunny" ? width * 0.06 : width * 0.045;

    const glow = ctx.createRadialGradient(
      centerX,
      centerY,
      sunRadius * 0.4,
      centerX,
      centerY,
      sunRadius * 2.6,
    );
    glow.addColorStop(0, "rgba(255, 220, 120, 0.55)");
    glow.addColorStop(1, "rgba(255, 220, 120, 0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius * 2.6, 0, Math.PI * 2);
    ctx.fill();

    if (targetCondition === "sunny") {
      ctx.strokeStyle = "rgba(255, 214, 112, 0.45)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const rayStart = sunRadius * 1.22;
        const rayEnd = sunRadius * 1.85;
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle) * rayStart,
          centerY + Math.sin(angle) * rayStart,
        );
        ctx.lineTo(
          centerX + Math.cos(angle) * rayEnd,
          centerY + Math.sin(angle) * rayEnd,
        );
        ctx.stroke();
      }
    }

    ctx.fillStyle = "rgba(255, 226, 140, 0.95)";
    ctx.beginPath();
    ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  if (moonAlpha < 0.02) return;

  ctx.save();
  ctx.globalAlpha = moonAlpha;
  ctx.translate(centerX, centerY);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);

  const moonRadius = width * 0.05;
  const halo = ctx.createRadialGradient(
    centerX,
    centerY,
    moonRadius * 0.3,
    centerX,
    centerY,
    moonRadius * 2.1,
  );
  halo.addColorStop(0, "rgba(180, 200, 255, 0.35)");
  halo.addColorStop(1, "rgba(180, 200, 255, 0)");

  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(centerX, centerY, moonRadius * 2.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(225, 232, 255, 0.92)";
  ctx.beginPath();
  ctx.arc(centerX, centerY, moonRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(35, 45, 80, 0.55)";
  ctx.beginPath();
  ctx.arc(
    centerX + moonRadius * 0.4,
    centerY - moonRadius * 0.15,
    moonRadius * 0.85,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  if (targetCondition !== "cloudy" && targetCondition !== "rainy") {
    for (const star of NIGHT_STARS) {
      ctx.fillStyle = "rgba(230, 240, 255, 0.6)";
      ctx.beginPath();
      ctx.arc(width * star.x, height * star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
};
