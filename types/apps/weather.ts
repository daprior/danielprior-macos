export interface WeatherProps {
  isDarkMode?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  size: number;

  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  drift?: number;
}

export interface DayProgressRef {
  value: number;
}

export interface CelestialMotionRef {
  angle: number;
  scale: number;
}
