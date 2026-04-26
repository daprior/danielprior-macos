import type {
  WeatherCityData,
  WeatherForecastDay,
} from "@/constants/weather-data";

const parseClockLabelToMinutes = (timeLabel: string) => {
  const match = timeLabel.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  const rawHour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (!Number.isFinite(rawHour) || !Number.isFinite(minute)) return null;

  const normalizedHour = rawHour % 12;
  const hour24 = period === "PM" ? normalizedHour + 12 : normalizedHour;
  return hour24 * 60 + minute;
};

export const getFallbackDaytime = (sunrise: string, sunset: string) => {
  const sunriseMinutes = parseClockLabelToMinutes(sunrise);
  const sunsetMinutes = parseClockLabelToMinutes(sunset);
  if (sunriseMinutes === null || sunsetMinutes === null) {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes >= sunriseMinutes && currentMinutes < sunsetMinutes;
};

export const celsiusToFahrenheit = (value: number) =>
  Math.round((value * 9) / 5 + 32);
export const fahrenheitToCelsius = (value: number) =>
  Math.round(((value - 32) * 5) / 9);
export const kmhToMph = (value: number) => Math.round(value / 1.60934);
export const mphToKmh = (value: number) => Math.round(value * 1.60934);

export const convertWeatherUnit = (
  data: WeatherCityData,
  fromUnit: "metric" | "imperial",
  toUnit: "metric" | "imperial",
): WeatherCityData => {
  if (fromUnit === toUnit) return data;

  const tempConverter =
    toUnit === "imperial" ? celsiusToFahrenheit : fahrenheitToCelsius;
  const windConverter = toUnit === "imperial" ? kmhToMph : mphToKmh;

  return {
    current: {
      ...data.current,
      temp: tempConverter(data.current.temp),
      feelsLike: tempConverter(data.current.feelsLike),
      windSpeed: windConverter(data.current.windSpeed),
    },
    forecast: data.forecast.map((day: WeatherForecastDay) => ({
      ...day,
      temp: tempConverter(day.temp),
      highTemp:
        typeof day.highTemp === "number"
          ? tempConverter(day.highTemp)
          : undefined,
      lowTemp:
        typeof day.lowTemp === "number"
          ? tempConverter(day.lowTemp)
          : undefined,
    })),
  };
};
