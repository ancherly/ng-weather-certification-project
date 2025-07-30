import { inject, Injectable } from "@angular/core";
import { CACHE_DURATION_MS } from "app/config/cache.config";

interface CacheEntry<T> {
  value: T;
  expireAtMs: number;
}

@Injectable({ providedIn: "root" })
export class CacheService {
  //Cache duration injected from the environment config or default value
  private readonly cacheDurationMs = inject(CACHE_DURATION_MS);

  //Generic method that saves a value in localStorage with an expiration or not
  set<T>(key: string, value: T, persistWithoutExpiration = false): void {
    const entry: Partial<CacheEntry<T>> = {
      value,
    };

    if (!persistWithoutExpiration) {
      entry.expireAtMs = Date.now() + this.cacheDurationMs;
    }

    localStorage.setItem(key, JSON.stringify(entry));
  }

  //Returns the required value if it has not yet expired
  //With flag to ignoreExpiration
  get<T>(key: string, ignoreExpiration = false): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      const entry: CacheEntry<T> = JSON.parse(raw);
      if (!ignoreExpiration && Date.now() > entry.expireAtMs) {
        localStorage.removeItem(key);
        return null;
      }
      return entry.value;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  }

  clear(key: string): void {
    localStorage.removeItem(key);
  }

  // Method used at the start of the application to clear the expired cache with the shame prefix
  clearExpiredCache(prefix: string): void {
    const now = Date.now();
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      try {
        const raw = localStorage.getItem(key)!;
        const entry = JSON.parse(raw);
        if (!entry.expireAtMs || entry.expireAtMs < now) {
          keysToRemove.push(key);
        }
      } catch {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  }
}
