import { Component, OnInit } from '@angular/core';

/**
 * Composant affiché lorsque l'utilisateur navigue vers une page inexistante.
 */

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
