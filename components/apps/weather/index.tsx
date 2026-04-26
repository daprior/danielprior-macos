"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  LocateFixed,
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_WEATHER_CITY,
  WEATHER_DATA,
  type WeatherCityData,
  type WeatherCondition,
} from "@/constants/weather-data";
import {
  fetchCitySuggestions,
  fetchWeatherByCity,
  fetchWeatherByCoords,
  normalizeWeatherCondition,
  type CitySuggestion,
} from "@/lib/weather-service";
import { useWeatherStore } from "@/store/useWeatherStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import type { WeatherProps, Particle } from "@/types/apps/weather";
import {
  getFallbackDaytime,
  convertWeatherUnit,
  drawSunOrMoon,
  initParticles,
  updateParticles,
} from "./lib";
import { WeatherPanels } from "./components/weather-panels";

export default function Weather({ isDarkMode = true }: WeatherProps) {
  // Weather state
  const selectedCity = useWeatherStore((state) => state.selectedCity);
  const unit = useWeatherStore((state) => state.unit);
  const locationCoords = useWeatherStore((state) => state.locationCoords);
  const autoLocateAttempted = useWeatherStore(
    (state) => state.autoLocateAttempted,
  );
  const setSelectedCity = useWeatherStore((state) => state.setSelectedCity);
  const setUnit = useWeatherStore((state) => state.setUnit);
  const setLocationCoords = useWeatherStore((state) => state.setLocationCoords);
  const clearLocationCoords = useWeatherStore(
    (state) => state.clearLocationCoords,
  );
  const setAutoLocateAttempted = useWeatherStore(
    (state) => state.setAutoLocateAttempted,
  );

  // Settings store
  const reduceMotion = useSettingsStore((state) => state.reduceMotion);

  const [displayCity, setDisplayCity] = useState(DEFAULT_WEATHER_CITY);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const [weather, setWeather] = useState<WeatherCityData>(
    WEATHER_DATA[DEFAULT_WEATHER_CITY],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "fallback">("fallback");
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const condition: WeatherCondition = normalizeWeatherCondition(
    weather.current.condition,
  );
  const isDaytime =
    typeof weather.current.isDaytime === "boolean"
      ? weather.current.isDaytime
      : getFallbackDaytime(weather.current.sunrise, weather.current.sunset);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const forecastRef = useRef<HTMLDivElement>(null);
  const weatherPanelsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotionRef = useRef(false);
  const blurTimeoutRef = useRef<number | null>(null);
  const dayProgressRef = useRef({ value: isDaytime ? 1 : 0 });
  const celestialMotionRef = useRef({ angle: 0, scale: 1 });
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDarkMode ? "text-white" : "text-gray-800";
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      prefersReducedMotionRef.current = media.matches || reduceMotion;
    };

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [reduceMotion]);

  useEffect(() => {
    const target = isDaytime ? 1 : 0;

    if (prefersReducedMotionRef.current) {
      dayProgressRef.current.value = target;
      celestialMotionRef.current.scale = 1;
      return;
    }

    gsap.killTweensOf(dayProgressRef.current);
    gsap.killTweensOf(celestialMotionRef.current);

    const timeline = gsap.timeline({ defaults: { overwrite: true } });
    timeline.to(
      dayProgressRef.current,
      {
        value: target,
        duration: 0.42,
        ease: "power3.inOut",
      },
      0,
    );
    timeline.to(
      celestialMotionRef.current,
      {
        angle: `+=220`,
        duration: 0.46,
        ease: "back.out(1.8)",
      },
      0,
    );
    timeline.fromTo(
      celestialMotionRef.current,
      { scale: 0.84 },
      {
        scale: 1.1,
        duration: 0.2,
        ease: "power3.out",
      },
      0,
    );
    timeline.to(
      celestialMotionRef.current,
      {
        scale: 1,
        duration: 0.18,
        ease: "power2.inOut",
      },
      0.2,
    );
  }, [isDaytime]);

  // Initialize particles and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    particles.current = initParticles(condition, isDarkMode);

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawSunOrMoon(
        ctx,
        canvas.width,
        canvas.height,
        dayProgressRef.current.value,
        condition,
        celestialMotionRef.current.angle,
        celestialMotionRef.current.scale,
      );

      updateParticles(
        particles.current,
        ctx,
        canvas.width,
        canvas.height,
        condition,
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [condition, isDarkMode]);

  useGSAP(
    () => {
      if (!showSuggestions || !suggestions.length) return;
      if (prefersReducedMotionRef.current) return;

      const items = gsap.utils.toArray<HTMLElement>("[data-suggestion-item]");
      gsap.fromTo(
        items,
        { opacity: 0, y: -8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.32,
          stagger: 0.05,
          ease: "power2.out",
          overwrite: true,
        },
      );
    },
    { scope: searchPanelRef, dependencies: [showSuggestions, suggestions] },
  );

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-forecast-card]");
      if (!cards.length) return;

      if (prefersReducedMotionRef.current) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      gsap.killTweensOf(cards);
      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.98, y: 8 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.36,
          stagger: 0.06,
          ease: "power2.out",
          overwrite: true,
          clearProps: "transform,opacity",
        },
      );
    },
    {
      scope: forecastRef,
      dependencies: [weather.forecast, displayCity, unit],
    },
  );

  useGSAP(
    () => {
      if (prefersReducedMotionRef.current) {
        if (canvasRef.current) {
          gsap.set(canvasRef.current, { opacity: 1, clearProps: "all" });
        }
        return;
      }

      if (weatherPanelsRef.current) {
        gsap.fromTo(
          weatherPanelsRef.current,
          { opacity: 0.9, y: 6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: "power2.out",
            overwrite: true,
            clearProps: "transform,opacity",
          },
        );
      }

      if (canvasRef.current) {
        gsap.fromTo(
          canvasRef.current,
          { opacity: 0.55 },
          { opacity: 1, duration: 0.48, ease: "power2.out", overwrite: true },
        );
      }
    },
    { scope: weatherPanelsRef, dependencies: [condition] },
  );

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setIsSuggestionsLoading(false);
      setActiveSuggestionIndex(-1);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSuggestionsLoading(true);
        const results = await fetchCitySuggestions(query, controller.signal);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSuggestionsLoading(false);
        setActiveSuggestionIndex(-1);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  const requestCurrentLocation = useCallback(
    (manual: boolean) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported in this browser.");
        setAutoLocateAttempted(true);
        return;
      }

      setLocationLoading(true);
      if (manual) setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setAutoLocateAttempted(true);
          setLocationLoading(false);
        },
        (locationError) => {
          if (
            manual ||
            locationError.code !== locationError.PERMISSION_DENIED
          ) {
            setError(
              "Unable to detect current location. Please search by city.",
            );
          }
          setAutoLocateAttempted(true);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000,
        },
      );
    },
    [setAutoLocateAttempted, setLocationCoords],
  );

  useEffect(() => {
    if (autoLocateAttempted) return;
    requestCurrentLocation(false);
  }, [autoLocateAttempted, requestCurrentLocation]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);

      const result = locationCoords
        ? await fetchWeatherByCoords(locationCoords, unit, controller.signal)
        : await fetchWeatherByCity(selectedCity, unit, controller.signal);

      if (!isMounted) return;

      setWeather(result.data);
      setDisplayCity(result.city);
      setSource(result.source);
      setUpdatedAt(result.updatedAt);

      if (
        result.source === "fallback" &&
        process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
      ) {
        setError(
          "Live weather is temporarily unavailable. Showing fallback data.",
        );
      }

      setIsLoading(false);
      setLocationLoading(false);
    };

    loadWeather().catch(() => {
      if (!isMounted) return;
      setError("Unable to load weather data right now.");
      setIsLoading(false);
      setLocationLoading(false);
    });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedCity, unit, locationCoords]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        window.clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleSuggestionSelect = (suggestion: CitySuggestion) => {
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setSearchQuery("");
    setSelectedCity(suggestion.query);
  };

  const handleSearch = () => {
    if (showSuggestions && activeSuggestionIndex >= 0) {
      const suggestion = suggestions[activeSuggestionIndex];
      if (suggestion) {
        handleSuggestionSelect(suggestion);
        return;
      }
    }

    const query = searchQuery.trim();
    if (!query) return;

    setSelectedCity(query);
    setSearchQuery("");
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const handleUnitChange = (nextUnit: "metric" | "imperial") => {
    if (nextUnit === unit) return;

    setWeather((previous) => convertWeatherUnit(previous, unit, nextUnit));
    setUnit(nextUnit);
  };

  const getWeatherIcon = (weatherCondition: WeatherCondition) => {
    if (weatherCondition === "sunny") return <Sun className="w-6 h-6" />;
    if (weatherCondition === "partly-cloudy")
      return <Cloud className="w-6 h-6" />;
    if (weatherCondition === "rainy") return <CloudRain className="w-6 h-6" />;
    if (weatherCondition === "snowy") return <CloudSnow className="w-6 h-6" />;
    return <Cloud className="w-6 h-6" />;
  };

  const windSpeedLabel = unit === "metric" ? "km/h" : "mph";
  const temperatureUnitLabel = unit === "metric" ? "C" : "F";
  const updatedAtLabel = updatedAt
    ? new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(updatedAt))
    : null;

  return (
    <div
      className={`h-full ${bgColor} ${textColor} flex flex-col relative overflow-hidden`}
    >
      {/* Canvas for weather effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Search bar */}
        <div className="p-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search city (e.g. Amman)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(searchQuery.trim().length >= 2)}
              onBlur={() => {
                blurTimeoutRef.current = window.setTimeout(() => {
                  setShowSuggestions(false);
                }, 120);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setShowSuggestions(true);
                  setActiveSuggestionIndex((prev) =>
                    Math.min(prev + 1, suggestions.length - 1),
                  );
                  return;
                }

                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
                  return;
                }

                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                  return;
                }

                if (e.key === "Escape") {
                  e.preventDefault();
                  setShowSuggestions(false);
                  setActiveSuggestionIndex(-1);
                }
              }}
              className={`pl-10 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

            {showSuggestions &&
              (searchQuery.trim().length >= 2 || suggestions.length > 0) && (
                <div
                  ref={searchPanelRef}
                  className={`absolute left-0 right-0 mt-2 rounded-md border z-30 overflow-hidden ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                >
                  {isSuggestionsLoading ? (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      Loading suggestions...
                    </p>
                  ) : suggestions.length ? (
                    <div className="max-h-52 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          data-suggestion-item
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionSelect(suggestion);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            activeSuggestionIndex === index
                              ? isDarkMode
                                ? "bg-gray-700 text-white"
                                : "bg-gray-100 text-gray-900"
                              : isDarkMode
                                ? "text-gray-200 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500">
                      No city suggestions found.
                    </p>
                  )}
                </div>
              )}
          </div>

          <Button
            type="button"
            variant={isDarkMode ? "outline" : "secondary"}
            className={isDarkMode ? "border-gray-700" : ""}
            onClick={() => {
              clearLocationCoords();
              requestCurrentLocation(true);
            }}
            disabled={locationLoading}
          >
            <LocateFixed className="w-4 h-4 mr-1" />
            {locationLoading ? "Locating..." : "My Location"}
          </Button>

          <Button
            type="button"
            variant={unit === "metric" ? "default" : "outline"}
            onClick={() => handleUnitChange("metric")}
          >
            °C
          </Button>
          <Button
            type="button"
            variant={unit === "imperial" ? "default" : "outline"}
            onClick={() => handleUnitChange("imperial")}
          >
            °F
          </Button>
          <Button
            type="button"
            onClick={handleSearch}
            variant={isDarkMode ? "outline" : "default"}
            className={isDarkMode ? "border-gray-700" : ""}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Search"}
          </Button>
        </div>

        {(error || updatedAtLabel) && (
          <div className="px-6 pb-1">
            {error && <p className="text-xs text-amber-500">{error}</p>}
            {updatedAtLabel && (
              <p className="text-xs text-gray-500">
                Updated {updatedAtLabel}{" "}
                {source === "fallback" ? "(fallback)" : "(live)"}
              </p>
            )}
          </div>
        )}

        <WeatherPanels
          weather={weather}
          displayCity={displayCity}
          cardBg={cardBg}
          borderColor={borderColor}
          temperatureUnitLabel={temperatureUnitLabel}
          windSpeedLabel={windSpeedLabel}
          isDarkMode={isDarkMode}
          weatherPanelsRef={weatherPanelsRef}
          forecastRef={forecastRef}
          getWeatherIcon={getWeatherIcon}
          setSearchQuery={setSearchQuery}
          setSelectedCity={setSelectedCity}
        />
      </div>
    </div>
  );
}
