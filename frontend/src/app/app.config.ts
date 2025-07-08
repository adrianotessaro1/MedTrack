import { registerLocaleData } from '@angular/common';
import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import localeEn from '@angular/common/locales/en';
import ptBr from '@angular/common/locales/pt';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService, TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

// Register the Angular locale data based on the user's browser language so date / numbers pipes respects the user's locale
if (window.navigator.language.match(/^en/i)) {
  registerLocaleData(localeEn);
} else {
  registerLocaleData(ptBr);
}

// Factory Function for the TranslateHttpLoader
// - Points to /assets/i18n/{lang}.json
// - Angular's DI will inject HttpClient
export function LangHttpLoaderFactory(
  httpClient: HttpClient
): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json');
}

// Determine the user's default language code('en' or 'pt-br')
const userLang = window.navigator.language.toLocaleLowerCase().startsWith('en')
  ? 'en'
  : 'pt-br';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: userLang },
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          // Tells ngx-translate to use the HTTP loader factory defined above
          provide: TranslateLoader,
          useFactory: LangHttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: userLang,
      }),
    ]),
  ],
};
