import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch  } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { NgChartsModule  } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch ()),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ]
};