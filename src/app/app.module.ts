import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { ZipcodeEntryComponent } from "./components/zipcode-entry/zipcode-entry.component";
import { ForecastsListComponent } from "./components/forecasts-list/forecasts-list.component";
import { CurrentConditionsComponent } from "./components/current-conditions/current-conditions.component";
import { MainPageComponent } from "./components/main-page/main-page.component";
import { RouterModule } from "@angular/router";
import { routing } from "./app.routing";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "../environments/environment";
import { TabsComponent } from "./components/tabs/tabs.component";
import { CacheService } from "./services/cache.service";
import {
  CACHE_DURATION_MS,
  cleanCacheFactory,
  DEFAULT_CACHE_DURATION_MS,
} from "./config/cache.config";

@NgModule({
  declarations: [
    AppComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    TabsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
  ],
  providers: [
    // APP_INITIALIZER for clean expired forecast cache
    {
      provide: APP_INITIALIZER,
      useFactory: cleanCacheFactory,
      deps: [CacheService],
      multi: true,
    },
    // DI to provide environment or default cache duration
    {
      provide: CACHE_DURATION_MS,
      useValue: environment.cache?.durationMS ?? DEFAULT_CACHE_DURATION_MS,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
