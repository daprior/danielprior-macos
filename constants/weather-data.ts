export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "rainy"
  | "snowy";

export interface WeatherForecastDay {
  day: string;
  temp: number;
  highTemp?: number;
  lowTemp?: number;
  condition: WeatherCondition;
}

export interface WeatherCityData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    sunrise: string;
    sunset: string;
    feelsLike: number;
    isDaytime?: boolean;
  };
  forecast: WeatherForecastDay[];
}

export const WEATHER_DATA: Record<string, WeatherCityData> = {
  "New York": {
    current: {
      temp: 18,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      sunrise: "6:15 AM",
      sunset: "7:45 PM",
      feelsLike: 17,
    },
    forecast: [
      { day: "Mon", temp: 19, condition: "sunny" },
      { day: "Tue", temp: 21, condition: "partly-cloudy" },
      { day: "Wed", temp: 17, condition: "rainy" },
      { day: "Thu", temp: 15, condition: "rainy" },
      { day: "Fri", temp: 14, condition: "snowy" },
    ],
  },
  London: {
    current: {
      temp: 14,
      condition: "Rainy",
      humidity: 80,
      windSpeed: 18,
      sunrise: "5:45 AM",
      sunset: "8:30 PM",
      feelsLike: 12,
    },
    forecast: [
      { day: "Mon", temp: 13, condition: "rainy" },
      { day: "Tue", temp: 14, condition: "rainy" },
      { day: "Wed", temp: 15, condition: "partly-cloudy" },
      { day: "Thu", temp: 16, condition: "partly-cloudy" },
      { day: "Fri", temp: 14, condition: "rainy" },
    ],
  },
  Tokyo: {
    current: {
      temp: 24,
      condition: "Sunny",
      humidity: 50,
      windSpeed: 8,
      sunrise: "4:30 AM",
      sunset: "6:45 PM",
      feelsLike: 25,
    },
    forecast: [
      { day: "Mon", temp: 25, condition: "sunny" },
      { day: "Tue", temp: 26, condition: "sunny" },
      { day: "Wed", temp: 24, condition: "partly-cloudy" },
      { day: "Thu", temp: 23, condition: "partly-cloudy" },
      { day: "Fri", temp: 25, condition: "sunny" },
    ],
  },
  Sydney: {
    current: {
      temp: 22,
      condition: "Sunny",
      humidity: 55,
      windSpeed: 15,
      sunrise: "6:30 AM",
      sunset: "5:15 PM",
      feelsLike: 23,
    },
    forecast: [
      { day: "Mon", temp: 23, condition: "sunny" },
      { day: "Tue", temp: 25, condition: "sunny" },
      { day: "Wed", temp: 21, condition: "partly-cloudy" },
      { day: "Thu", temp: 19, condition: "rainy" },
      { day: "Fri", temp: 20, condition: "partly-cloudy" },
    ],
  },
  Paris: {
    current: {
      temp: 16,
      condition: "Partly Cloudy",
      humidity: 60,
      windSpeed: 10,
      sunrise: "6:00 AM",
      sunset: "8:15 PM",
      feelsLike: 15,
    },
    forecast: [
      { day: "Mon", temp: 17, condition: "partly-cloudy" },
      { day: "Tue", temp: 18, condition: "partly-cloudy" },
      { day: "Wed", temp: 16, condition: "rainy" },
      { day: "Thu", temp: 15, condition: "rainy" },
      { day: "Fri", temp: 17, condition: "partly-cloudy" },
    ],
  },
};

export const DEFAULT_WEATHER_CITY = "New York";
