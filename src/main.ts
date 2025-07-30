import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

/**
 * Fichier principal chargant le module racine et supprimant l'élément
 * d'indicateur de chargement une fois l'application démarrée.
 */

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err))
  .finally(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.remove();
    }
  });