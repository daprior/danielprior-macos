import {
  DEFAULT_WEATHER_CITY,
  WEATHER_DATA,
  type WeatherCityData,
  type WeatherCondition,
  type WeatherForecastDay,
} from "@/constants/weather-data";

export type WeatherUnit = "metric" | "imperial";

export type WeatherSource = "api" | "fallback";

export type WeatherCoordinates = {
  lat: number;
  lon: number;
};

export interface CitySuggestion {
  id: string;
  label: string;
  query: string;
  coordinates: WeatherCoordinates;
}

export interface WeatherFetchResult {
  city: string;
  data: WeatherCityData;
  source: WeatherSource;
  updatedAt: number;
}

type CacheEntry = {
  result: WeatherFetchResult;
  createdAt: number;
};

type OpenWeatherGeocode = {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
};

type OpenWeatherCurrentResponse = {
  dt: number;
  weather: Array<{ main: string; description: string }>;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  name: string;
};

type OpenWeatherForecastResponse = {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{ main: string; description: string }>;
  }>;
  city: {
    timezone: number;
  };
};

const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_CACHE_TTL_MS = 10 * 60 * 1000;
const middayTargetHour = 12;
const weatherCache = new Map<string, CacheEntry>();

const getCacheTtlMs = () => {
  const raw = process.env.NEXT_PUBLIC_WEATHER_CACHE_TTL_MINUTES;
  if (!raw) return DEFAULT_CACHE_TTL_MS;

  const minutes = Number(raw);
  if (!Number.isFinite(minutes) || minutes <= 0) return DEFAULT_CACHE_TTL_MS;
  return minutes * 60 * 1000;
};

const cacheKeyFor = (city: string, unit: WeatherUnit) =>
  `${city.trim().toLowerCase()}::${unit}`;

const cacheKeyForCoords = (coords: WeatherCoordinates, unit: WeatherUnit) =>
  `${coords.lat.toFixed(3)},${coords.lon.toFixed(3)}::${unit}`;

const capitalizeWords = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

const celsiusToFahrenheit = (value: number) => Math.round(value * 1.8 + 32);

const kmhToMph = (value: number) => Math.round(value / 1.60934);

const formatTimeFromUnix = (
  unixSeconds: number,
  timezoneOffsetSeconds: number,
) => {
  const zonedDate = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(zonedDate);
};

const formatWeekdayFromUnix = (
  unixSeconds: number,
  timezoneOffsetSeconds: number,
) => {
  const zonedDate = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(zonedDate);
};

const getDateKey = (unixSeconds: number, timezoneOffsetSeconds: number) => {
  const zonedDate = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
  return zonedDate.toISOString().slice(0, 10);
};

export const normalizeWeatherCondition = (value: string): WeatherCondition => {
  const normalized = value.toLowerCase();
  if (normalized.includes("snow")) return "snowy";
  if (normalized.includes("rain") || normalized.includes("drizzle"))
    return "rainy";
  if (normalized.includes("clear") || normalized.includes("sun"))
    return "sunny";
  if (normalized.includes("cloud")) return "partly-cloudy";
  return "cloudy";
};

const toFallbackDataForUnit = (
  data: WeatherCityData,
  unit: WeatherUnit,
): WeatherCityData => {
  if (unit === "metric") return data;

  return {
    current: {
      ...data.current,
      temp: celsiusToFahrenheit(data.current.temp),
      feelsLike: celsiusToFahrenheit(data.current.feelsLike),
      windSpeed: kmhToMph(data.current.windSpeed),
    },
    forecast: data.forecast.map((day) => ({
      ...day,
      temp: celsiusToFahrenheit(day.temp),
    })),
  };
};

const findFallbackCity = (query: string) => {
  const trimmed = query.trim();
  if (!trimmed) return DEFAULT_WEATHER_CITY;

  const exact = Object.keys(WEATHER_DATA).find(
    (city) => city.toLowerCase() === trimmed.toLowerCase(),
  );
  if (exact) return exact;

  const partial = Object.keys(WEATHER_DATA).find((city) =>
    city.toLowerCase().includes(trimmed.toLowerCase()),
  );
  return partial ?? DEFAULT_WEATHER_CITY;
};

const getLocalSuggestions = (query: string): CitySuggestion[] => {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  return Object.keys(WEATHER_DATA)
    .filter((city) => city.toLowerCase().includes(normalized))
    .slice(0, 5)
    .map((city, index) => ({
      id: `local-${city}-${index}`,
      label: city,
      query: city,
      coordinates: { lat: 0, lon: 0 },
    }));
};

const getFallbackResult = (
  city: string,
  unit: WeatherUnit,
): WeatherFetchResult => {
  const fallbackCity = findFallbackCity(city);
  return {
    city: fallbackCity,
    source: "fallback",
    updatedAt: Date.now(),
    data: toFallbackDataForUnit(WEATHER_DATA[fallbackCity], unit),
  };
};

const mapForecast = (
  response: OpenWeatherForecastResponse,
  timezoneOffsetSeconds: number,
): WeatherForecastDay[] => {
  const entriesByDate = new Map<
    string,
    {
      minTemp: number;
      maxTemp: number;
      representativeHourDistance: number;
      representativeCondition: WeatherCondition;
      representativeTimestamp: number;
    }
  >();

  for (const item of response.list) {
    const key = getDateKey(item.dt, timezoneOffsetSeconds);
    const dateWithZone = new Date((item.dt + timezoneOffsetSeconds) * 1000);
    const hour = dateWithZone.getUTCHours();
    const hourDistance = Math.abs(hour - middayTargetHour);

    const currentTemp = item.main.temp;
    const currentCondition = normalizeWeatherCondition(
      item.weather[0]?.main ?? item.weather[0]?.description ?? "Clouds",
    );

    const existing = entriesByDate.get(key);
    if (!existing) {
      entriesByDate.set(key, {
        minTemp: currentTemp,
        maxTemp: currentTemp,
        representativeHourDistance: hourDistance,
        representativeCondition: currentCondition,
        representativeTimestamp: item.dt,
      });
      continue;
    }

    existing.minTemp = Math.min(existing.minTemp, currentTemp);
    existing.maxTemp = Math.max(existing.maxTemp, currentTemp);

    if (hourDistance < existing.representativeHourDistance) {
      existing.representativeHourDistance = hourDistance;
      existing.representativeCondition = currentCondition;
      existing.representativeTimestamp = item.dt;
    }
  }

  return [...entriesByDate.entries()]
    .sort(([dateA], [dateB]) => (dateA < dateB ? -1 : 1))
    .slice(0, 5)
    .map(([, value]) => {
      const lowTemp = Math.round(value.minTemp);
      const highTemp = Math.round(value.maxTemp);
      return {
        day: formatWeekdayFromUnix(
          value.representativeTimestamp,
          timezoneOffsetSeconds,
        ),
        temp: Math.round((value.minTemp + value.maxTemp) / 2),
        lowTemp,
        highTemp,
        condition: value.representativeCondition,
      };
    });
};

const fetchWithJson = async <T>(
  url: string,
  signal: AbortSignal,
): Promise<T> => {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

const createAbortControllerWithTimeout = (signal?: AbortSignal) => {
  const controller = new AbortController();
  const abortListener = () => controller.abort();
  signal?.addEventListener("abort", abortListener);
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    DEFAULT_TIMEOUT_MS,
  );

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", abortListener);
    },
  };
};

const buildApiWeatherResult = async ({
  lat,
  lon,
  cityHint,
  unit,
  apiKey,
  signal,
  updatedAt,
}: {
  lat: number;
  lon: number;
  cityHint: string;
  unit: WeatherUnit;
  apiKey: string;
  signal: AbortSignal;
  updatedAt: number;
}): Promise<WeatherFetchResult> => {
  const query = `lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  const [current, forecast] = await Promise.all([
    fetchWithJson<OpenWeatherCurrentResponse>(
      `https://api.openweathermap.org/data/2.5/weather?${query}`,
      signal,
    ),
    fetchWithJson<OpenWeatherForecastResponse>(
      `https://api.openweathermap.org/data/2.5/forecast?${query}`,
      signal,
    ),
  ]);

  const timezoneOffset = current.timezone ?? forecast.city.timezone ?? 0;
  const isDaytime =
    current.dt >= current.sys.sunrise && current.dt < current.sys.sunset;

  return {
    city: current.name || cityHint,
    source: "api",
    updatedAt,
    data: {
      current: {
        temp: Math.round(current.main.temp),
        condition: capitalizeWords(
          current.weather[0]?.description ??
            current.weather[0]?.main ??
            "Cloudy",
        ),
        humidity: Math.round(current.main.humidity),
        windSpeed:
          unit === "metric"
            ? Math.round((current.wind.speed ?? 0) * 3.6)
            : Math.round(current.wind.speed ?? 0),
        sunrise: formatTimeFromUnix(current.sys.sunrise, timezoneOffset),
        sunset: formatTimeFromUnix(current.sys.sunset, timezoneOffset),
        feelsLike: Math.round(current.main.feels_like),
        isDaytime,
      },
      forecast: mapForecast(forecast, timezoneOffset),
    },
  };
};

export const fetchCitySuggestions = async (
  query: string,
  signal?: AbortSignal,
): Promise<CitySuggestion[]> => {
  const normalized = query.trim();
  if (normalized.length < 2) return [];

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY?.trim();
  if (!apiKey) {
    return getLocalSuggestions(normalized);
  }

  const timeoutController = createAbortControllerWithTimeout(signal);

  try {
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      normalized,
    )}&limit=6&appid=${apiKey}`;
    const geocodeData = await fetchWithJson<OpenWeatherGeocode[]>(
      geocodeUrl,
      timeoutController.signal,
    );

    const seen = new Set<string>();
    const suggestions: CitySuggestion[] = [];

    for (const item of geocodeData) {
      const id = `${item.name}-${item.state ?? ""}-${item.country ?? ""}`
        .toLowerCase()
        .trim();
      if (seen.has(id)) continue;
      seen.add(id);

      const parts = [item.name, item.state, item.country].filter(Boolean);
      const label = parts.join(", ");
      suggestions.push({
        id,
        label,
        query: `${item.name}${item.country ? `, ${item.country}` : ""}`,
        coordinates: { lat: item.lat, lon: item.lon },
      });
    }

    return suggestions;
  } catch {
    return getLocalSuggestions(normalized);
  } finally {
    timeoutController.cleanup();
  }
};

export const fetchWeatherByCity = async (
  city: string,
  unit: WeatherUnit,
  signal?: AbortSignal,
): Promise<WeatherFetchResult> => {
  const normalizedCity = city.trim();
  const key = cacheKeyFor(normalizedCity, unit);
  const cacheTtlMs = getCacheTtlMs();
  const now = Date.now();

  const cached = weatherCache.get(key);
  if (cached && now - cached.createdAt < cacheTtlMs) {
    return cached.result;
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY?.trim();
  if (!apiKey) {
    const fallback = getFallbackResult(normalizedCity, unit);
    weatherCache.set(key, { result: fallback, createdAt: now });
    return fallback;
  }

  const timeoutController = createAbortControllerWithTimeout(signal);

  try {
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      normalizedCity,
    )}&limit=1&appid=${apiKey}`;
    const geocodeData = await fetchWithJson<OpenWeatherGeocode[]>(
      geocodeUrl,
      timeoutController.signal,
    );

    if (!geocodeData.length) {
      throw new Error("City not found");
    }

    const target = geocodeData[0];
    const result = await buildApiWeatherResult({
      lat: target.lat,
      lon: target.lon,
      cityHint: target.name,
      unit,
      apiKey,
      signal: timeoutController.signal,
      updatedAt: now,
    });

    weatherCache.set(key, { result, createdAt: now });
    return result;
  } catch {
    const fallback = getFallbackResult(normalizedCity, unit);
    weatherCache.set(key, { result: fallback, createdAt: now });
    return fallback;
  } finally {
    timeoutController.cleanup();
  }
};

export const fetchWeatherByCoords = async (
  coords: WeatherCoordinates,
  unit: WeatherUnit,
  signal?: AbortSignal,
): Promise<WeatherFetchResult> => {
  const key = cacheKeyForCoords(coords, unit);
  const cacheTtlMs = getCacheTtlMs();
  const now = Date.now();

  const cached = weatherCache.get(key);
  if (cached && now - cached.createdAt < cacheTtlMs) {
    return cached.result;
  }

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY?.trim();
  if (!apiKey) {
    const fallback = getFallbackResult(DEFAULT_WEATHER_CITY, unit);
    weatherCache.set(key, { result: fallback, createdAt: now });
    return fallback;
  }

  const timeoutController = createAbortControllerWithTimeout(signal);

  try {
    const result = await buildApiWeatherResult({
      lat: coords.lat,
      lon: coords.lon,
      cityHint: "Current Location",
      unit,
      apiKey,
      signal: timeoutController.signal,
      updatedAt: now,
    });

    weatherCache.set(key, { result, createdAt: now });
    return result;
  } catch {
    const fallback = getFallbackResult(DEFAULT_WEATHER_CITY, unit);
    weatherCache.set(key, { result: fallback, createdAt: now });
    return fallback;
  } finally {
    timeoutController.cleanup();
  }
};
