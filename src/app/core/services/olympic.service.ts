import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

/**
 * Service centralisant toutes les opérations liées aux données olympiques.
 * Fournit des méthodes de chargement et d'accès aux pays enregistrés.
 */

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  // URL du fichier JSON contenant les données
  private olympicUrl = './assets/mock/olympic.json';
  
  // Subject pour stocker et diffuser les données olympiques
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Charge les données initiales depuis le fichier JSON
   * @returns Observable contenant les données ou null en cas d'erreur
   */
  loadInitialData(): Observable<Olympic[] | null> {
    // Évite de recharger si les données sont déjà présentes
    if (this.olympics$.value) {
      return this.olympics$.asObservable();
    }

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap(data => {
        console.log('Données olympiques chargées:', data);
        this.olympics$.next(data);
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des données:', error);
        this.olympics$.next(null);
        // Propage l'erreur pour que les composants puissent la gérer
        return throwError(() => new Error('Impossible de charger les données. Veuillez réessayer plus tard.'));
      })
    );
  }

  /**
   * Retourne un Observable des données olympiques
   * @returns Observable des données olympiques
   */
  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }

  /**
   * Récupère les données d'un pays spécifique par son ID
   * @param id - Identifiant du pays
   * @returns Observable du pays ou undefined si non trouvé
   */
  getOlympicById(id: number): Observable<Olympic | undefined> {
    return new Observable(observer => {
      this.olympics$.subscribe(olympics => {
        if (olympics) {
          const country = olympics.find(o => o.id === id);
          observer.next(country);
        } else {
          observer.next(undefined);
        }
        observer.complete();
      });
    });
  }
}