import { inject, Injectable, Signal, signal } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { CurrentConditions } from "../components/current-conditions/current-conditions.type";
import { ConditionsAndZip } from "../models/conditions-and-zip.type";
import { Forecast } from "../components/forecasts-list/forecast.type";
import { LocationService } from "./location.service";
import { CacheService } from "./cache.service";

@Injectable({ providedIn: "root" })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(CacheService);
  private readonly locationService = inject(LocationService);

  static URL = "https://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private currentConditions = signal<ConditionsAndZip[]>(
    this.loadLocationsFromCache()
  );

  fetchOrLoadConditions(zip: string): void {
    const cacheKey = `weather-current-${zip}`;
    const cached = this.cache.get<CurrentConditions>(cacheKey);
    if (cached) return;

    this.fetchConditions(zip).subscribe({
      next: (data) => {
        this.addCurrentConditions(zip, data);
      },
      error: () => {
        console.error(`Could not fetch weather for zip ${zip}`);
      },
    });
  }

  fetchConditions(zipcode: string): Observable<CurrentConditions> {
    return this.http.get<CurrentConditions>(
      `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
    );
  }

  get currentConditionsSignal(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  //Fetch the information for the 5 days from localStorage or the API.
  getForecast(zip: string): Observable<Forecast> {
    const cacheKey = `weather-forecast-${zip}`;
    const cached = this.cache.get<Forecast>(cacheKey);
    if (cached) return of(cached);

    return this.http
      .get<Forecast>(
        `${WeatherService.URL}/forecast/daily?zip=${zip},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
      )
      .pipe(tap((data) => this.cache.set(cacheKey, data)));
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }

  addCurrentConditions(zipcode: string, data: CurrentConditions): void {
    this.cache.set(`weather-current-${zipcode}`, data);
    this.currentConditions.update((list) => [...list, { zip: zipcode, data }]);
  }

  removeConditions(zip: string): void {
    this.currentConditions.update((list) =>
      list.filter((entry) => entry.zip !== zip)
    );
    this.cache.clear(`weather-current-${zip}`);
    this.cache.clear(`weather-forecast-${zip}`);
  }

  private loadLocationsFromCache(): ConditionsAndZip[] {
    const stored = this.locationService.locations();
    if (!stored) return [];

    const conditions: ConditionsAndZip[] = [];

    stored.forEach((zipCode) => {
      const raw = localStorage.getItem(`weather-current-${zipCode}`);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const data = parsed?.value;

          if (data) {
            conditions.push({ zip: zipCode, data });
          }
        } catch (e) {
          console.warn("Error parsing condition from cache", e);
        }
      }
    });

    return conditions;
  }
}
