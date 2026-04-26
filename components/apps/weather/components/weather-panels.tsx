"use client";

import type { RefObject } from "react";
import { MapPin, Droplets, Wind, Sunrise, Sunset } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WEATHER_DATA,
  type WeatherCityData,
  type WeatherCondition,
} from "@/constants/weather-data";

interface WeatherPanelsProps {
  weather: WeatherCityData;
  displayCity: string;
  cardBg: string;
  borderColor: string;
  temperatureUnitLabel: string;
  windSpeedLabel: string;
  isDarkMode: boolean;
  weatherPanelsRef: RefObject<HTMLDivElement | null>;
  forecastRef: RefObject<HTMLDivElement | null>;
  getWeatherIcon: (condition: WeatherCondition) => React.ReactNode;
  setSearchQuery: (value: string) => void;
  setSelectedCity: (cityName: string) => void;
}

export function WeatherPanels({
  weather,
  displayCity,
  cardBg,
  borderColor,
  temperatureUnitLabel,
  windSpeedLabel,
  isDarkMode,
  weatherPanelsRef,
  forecastRef,
  getWeatherIcon,
  setSearchQuery,
  setSelectedCity,
}: WeatherPanelsProps) {
  return (
    <>
      <div ref={weatherPanelsRef}>
        <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <h2 className="text-2xl font-bold">{displayCity}</h2>
            </div>
            <p className="text-gray-500 text-sm mt-1">Today</p>

            <div className="flex items-center mt-4">
              <div className="text-6xl font-light mr-4">
                {weather.current.temp}°{temperatureUnitLabel}
              </div>
              <div>
                <p className="text-lg">{weather.current.condition}</p>
                <p className="text-sm text-gray-500">
                  Feels like {weather.current.feelsLike}°{temperatureUnitLabel}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${cardBg} p-4 rounded-lg border ${borderColor} grid grid-cols-2 gap-4 w-full md:w-auto`}
          >
            <div className="flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Humidity</p>
                <p className="font-medium">{weather.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wind className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Wind</p>
                <p className="font-medium">
                  {weather.current.windSpeed} {windSpeedLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Sunrise className="w-5 h-5 mr-2 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Sunrise</p>
                <p className="font-medium">{weather.current.sunrise}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Sunset className="w-5 h-5 mr-2 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Sunset</p>
                <p className="font-medium">{weather.current.sunset}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-4">
        <h3 className="text-lg font-medium mb-3">5-Day Forecast</h3>
        <div
          ref={forecastRef}
          className={`grid grid-cols-5 gap-2 ${cardBg} rounded-lg border ${borderColor} p-4`}
        >
          {weather.forecast.map((day, index) => (
            <div
              key={index}
              data-forecast-card
              className="flex flex-col items-center"
            >
              <p className="font-medium">{day.day}</p>
              <div className="my-2">{getWeatherIcon(day.condition)}</div>
              <p className="text-lg font-medium">
                {day.temp}°{temperatureUnitLabel}
              </p>
              <p className="text-xs text-gray-500">
                H {day.highTemp ?? day.temp}°{temperatureUnitLabel} / L{" "}
                {day.lowTemp ?? day.temp}°{temperatureUnitLabel}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        <h3 className="text-lg font-medium mb-3">Popular Cities</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(WEATHER_DATA).map((cityName) => (
            <Button
              key={cityName}
              variant={displayCity === cityName ? "default" : "outline"}
              className={`${displayCity === cityName ? "" : isDarkMode ? "border-gray-700" : "border-gray-300"}`}
              onClick={() => {
                setSearchQuery("");
                setSelectedCity(cityName);
              }}
            >
              {cityName}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
