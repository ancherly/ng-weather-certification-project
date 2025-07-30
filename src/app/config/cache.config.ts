import { InjectionToken } from "@angular/core";
import { CacheService } from "../services/cache.service";

// Default cache duration used if no value is provided via the environment (2 hours)
export const DEFAULT_CACHE_DURATION_MS = 7200000;

// Injection token for cache duration, configured in AppModule with useValue
export const CACHE_DURATION_MS = new InjectionToken<number>(
  "CACHE_DURATION_MS"
);

// Factory used in APP_INITIALIZER to clean up expired forecast wheaters on app startup
export function cleanCacheFactory(cache: CacheService): () => void {
  return () => {
    cache.clearExpiredCache(CacheKeys.WEATHER_CURRENT);
  };
}

//Centralize available cache keys
export const CacheKeys = {
  WEATHER_CURRENT: "weather-current",
  WEATHER_CURRENT_ZIP: (zip: string) => `weather-current-${zip}`,
  FORECAST: "weather-forecast",
  WEATHER_FORECAST_ZIP: (zip: string) => `weather-forecast-${zip}`,
  LOCATIONS: "locations",
} as const;
