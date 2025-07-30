import { Component } from '@angular/core';

/**
 * Point d'entrée visuel de l'application.
 * Contient uniquement le template et les styles principaux.
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'olympic-games-app';
}