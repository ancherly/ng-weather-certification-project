import { Injectable, Signal, signal } from "@angular/core";

const LOCATIONS = "locations";

@Injectable({ providedIn: "root" })
export class LocationService {
  // Reactive list of zip codes, saved in localStorage
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
    const stored = localStorage.getItem(LOCATIONS);
    if (!stored) return [];

    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn(
        "An error occurred while retrieving the locations from local storage.",
        e
      );
      return [];
    }
  }

  // Save locations to localStorage after any modification.
  private saveLocations(locations: string[]): void {
    try {
      if (locations.length === 0) {
        localStorage.removeItem(LOCATIONS);
      } else {
        localStorage.setItem(LOCATIONS, JSON.stringify(locations));
      }
    } catch (e) {
      console.warn("Error saving locations to localStorage", e);
    }
  }
}
