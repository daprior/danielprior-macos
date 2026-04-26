import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { DEFAULT_WEATHER_CITY } from "@/constants/weather-data";
import { noopStorage } from "@/store/noop-storage";
import type { WeatherCoordinates, WeatherUnit } from "@/lib/weather-service";
import { createSelectors } from "./createSelectors";

type WeatherState = {
  selectedCity: string;
  unit: WeatherUnit;
  locationCoords: WeatherCoordinates | null;
  autoLocateAttempted: boolean;
};

type WeatherActions = {
  setSelectedCity: (city: string) => void;
  setUnit: (unit: WeatherUnit) => void;
  setLocationCoords: (coords: WeatherCoordinates) => void;
  clearLocationCoords: () => void;
  setAutoLocateAttempted: (value: boolean) => void;
};

export type WeatherStore = WeatherState & WeatherActions;

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      selectedCity: DEFAULT_WEATHER_CITY,
      unit: "metric",
      locationCoords: null,
      autoLocateAttempted: false,
      setSelectedCity: (city) =>
        set({ selectedCity: city, locationCoords: null }),
      setUnit: (unit) => set({ unit }),
      setLocationCoords: (coords) => set({ locationCoords: coords }),
      clearLocationCoords: () => set({ locationCoords: null }),
      setAutoLocateAttempted: (value) => set({ autoLocateAttempted: value }),
    }),
    {
      name: STORAGE_KEYS.weatherState,
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.localStorage,
      ),
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        unit: state.unit,
        locationCoords: state.locationCoords,
        autoLocateAttempted: state.autoLocateAttempted,
      }),
    },
  ),
);

export const useWeatherStoreSelectors = createSelectors(useWeatherStore);
