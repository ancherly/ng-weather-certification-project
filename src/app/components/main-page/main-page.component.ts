import { Component, effect, inject, signal } from "@angular/core";
import { LocationService } from "../../services/location.service";
import { WeatherService } from "app/services/weather.service";
import { CACHE_DURATION_MS } from "app/config/cache.config";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent {
  private readonly locationService = inject(LocationService);
  private readonly weatherService = inject(WeatherService);
  private readonly cacheDurationMs = inject(CACHE_DURATION_MS);
  readonly tabs = signal<{ id: string; label: string }[]>([]);

  constructor() {
    effect(
      () => {
        const zips = this.locationService.locations();
        const currentData = this.weatherService.currentConditionsSignal();
        const mapped = zips.map((zip) => {
          const match = currentData.find((c) => c.zip === zip);
          const label = match ? `${match.data.name} (${zip})` : zip;
          return { id: zip, label };
        });
        this.tabs.set(mapped);
      },
      { allowSignalWrites: true }
    );
  }

  selectLocationCondition(zip: string) {
    this.weatherService.fetchOrLoadConditions(zip);
  }

  removeLocation(zip: string) {
    this.locationService.removeLocation(zip);
    this.weatherService.removeConditions(zip);
  }

  get cacheDurationInfo(): string {
    const ms = this.cacheDurationMs;

    if (ms < 60000) {
      const seconds = Math.floor(ms / 1000);
      return `${seconds}s`;
    }

    if (ms < 3600000) {
      const minutes = Math.floor(ms / 60_000);
      return `${minutes}min`;
    }

    const hours = ms / 3600000;
    return `${hours % 1 === 0 ? hours : hours.toFixed(1)}h`;
  }
}
