import { inject, Injectable, Signal, signal } from "@angular/core";
import { CacheService } from "./cache.service";
import { CacheKeys } from "app/config/cache.config";

@Injectable({ providedIn: "root" })
export class LocationService {
  private readonly cacheService = inject(CacheService);

  // Reactive list of zip codes
  private _locations = signal<string[]>(this.loadLocationsFromCache());

  get locations(): Signal<string[]> {
    return this._locations.asReadonly();
  }

  addLocation(zipcode: string) {
    this._locations.update((locations) => {
      if (locations.includes(zipcode)) return locations;

      const updated = [...locations, zipcode];
      this.saveLocations(updated);
      return updated;
    });
  }

  removeLocation(zipcode: string) {
    this._locations.update((locations) => {
      const updated = locations.filter((z) => z !== zipcode);
      this.saveLocations(updated);
      return updated;
    });
  }

  //Load available locations from localStorage when initializing the signal
  private loadLocationsFromCache(): string[] {
    const storedLocations = this.cacheService.get<string[]>(
      CacheKeys.LOCATIONS,
      true
    );
    if (!storedLocations) return [];
    else return storedLocations;
  }

  // Save locations to localStorage after any modification.
  private saveLocations(locations: string[]): void {
    if (locations.length === 0) {
      this.cacheService.clear(CacheKeys.LOCATIONS);
    } else {
      this.cacheService.set(CacheKeys.LOCATIONS, locations, true);
    }
  }
}
