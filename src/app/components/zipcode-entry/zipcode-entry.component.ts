import { Component, inject } from "@angular/core";
import { LocationService } from "../../services/location.service";
import { WeatherService } from "app/services/weather.service";

@Component({
  selector: "app-zipcode-entry",
  templateUrl: "./zipcode-entry.component.html",
})
export class ZipcodeEntryComponent {
  private readonly weatherService = inject(WeatherService);
  private readonly locationService = inject(LocationService);
  zipcode = "";

  addLocation(zipcode: string): void {
    if (this.locationService.locations().includes(zipcode)) return;

    this.weatherService.fetchConditions(zipcode).subscribe({
      next: (data) => {
        this.locationService.addLocation(zipcode);
        this.weatherService.addCurrentConditions(zipcode, data);
      },
      error: () => alert(`Invalid or unavailable postal code: ${zipcode}`),
    });
  }
}
