import { Component, Input, inject } from "@angular/core";
import { WeatherService } from "../../services/weather.service";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
})
export class CurrentConditionsComponent {
  @Input() zipcode!: string;

  private weatherService = inject(WeatherService);

  get location() {
    return this.weatherService
      .currentConditionsSignal()
      .find((c) => c.zip === this.zipcode);
  }

  getWeatherIcon(id: number): string {
    return this.weatherService.getWeatherIcon(id);
  }
}
