import { Component, effect, inject, signal } from "@angular/core";
import { LocationService } from "../../services/location.service";
import { WeatherService } from "app/services/weather.service";
import { CACHE_DURATION_MS } from "app/config/cache.config";
import { Tab } from "app/models/tab";
import { Router } from "@angular/router";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
})
export class MainPageComponent {
  private readonly locationService = inject(LocationService);
  private readonly weatherService = inject(WeatherService);
  private readonly cacheDurationMs = inject(CACHE_DURATION_MS);
  private readonly router = inject(Router);
  readonly tabs = signal<Tab[]>([]);
  lastTabSelected!: string | null;

  constructor() {
    this.checkLastTabSelected();
    this.syncronizeTabs();
  }

  //Check last tab is selected when coming back from forecast route
  private checkLastTabSelected(): void {
    const navigation = this.router.getCurrentNavigation();
    const isRefresh = navigation?.extras?.replaceUrl === true;
    const lastTab = navigation?.extras.state?.["lastTab"];

    if (!isRefresh && lastTab) {
      this.lastTabSelected = lastTab;
    }
  }

  //Reactive detection of locations with conditions to manage tabs
  //Set selection true from the last tab selection if coming from forecast route
  private syncronizeTabs(): void {
    effect(
      () => {
        const zips = this.locationService.locations();
        const currentData = this.weatherService.currentConditionsSignal();

        const mapped = zips.map((zip) => {
          const match = currentData.find((c) => c.zip === zip);
          const label = match ? `${match.data.name} (${zip})` : zip;
          return {
            id: zip,
            label,
            selected: zip === this.lastTabSelected,
          };
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

  //Method to see properly info cache configured
  get cacheDurationInfo(): string {
    const ms = this.cacheDurationMs;

    if (ms < 60000) {
      const seconds = Math.floor(ms / 1000);
      return `${seconds}s`;
    }

    if (ms < 3600000) {
      const minutes = Math.floor(ms / 60000);
      return `${minutes}min`;
    }

    const hours = ms / 3600000;
    return `${hours % 1 === 0 ? hours : hours.toFixed(1)}h`;
  }
}
