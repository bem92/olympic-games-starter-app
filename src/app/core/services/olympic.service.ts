import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { ChartData } from '../models/ChartData';
import { LineChartData } from '../models/LineChartData';

/**
 * Service centralisant toutes les opérations liées aux données olympiques.
 * Fournit des méthodes de chargement et d'accès aux pays enregistrés.
 */

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  // URL du fichier JSON contenant les données
  private readonly olympicUrl = 'assets/mock/olympic.json';

  // Subject pour stocker et diffuser les données olympiques
  private readonly olympicsSubject = new BehaviorSubject<Olympic[] | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Charge les données initiales depuis le fichier JSON
   * @returns Observable contenant les données ou null en cas d'erreur
   */
  loadInitialData(): Observable<Olympic[] | null> {
    // Évite de recharger si les données sont déjà présentes
    if (this.olympicsSubject.value) {
      return this.olympicsSubject.asObservable();
    }

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap(data => {
        console.log('Données olympiques chargées:', data);
        this.olympicsSubject.next(data);
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des données:', error);
        this.olympicsSubject.next(null);
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
    return this.olympicsSubject.asObservable();
  }

  /**
   * Récupère les données d'un pays spécifique par son ID
   * @param id - Identifiant du pays
   * @returns Observable du pays ou undefined si non trouvé
   */
  getOlympicById(id: number): Observable<Olympic | undefined> {
    return this.olympicsSubject.pipe(
      map(olympics => olympics?.find(o => o.id === id))
    );
  }

  /**
   * Calcule le total de médailles et d'athlètes d'un pays
   * @param country - Pays concerné
   */
  calculateCountryStats(country: Olympic): { totalMedals: number; totalAthletes: number } {
    const totalMedals = country.participations.reduce((sum, p) => sum + p.medalsCount, 0);
    const totalAthletes = country.participations.reduce((sum, p) => sum + p.athleteCount, 0);
    return { totalMedals, totalAthletes };
  }

  /**
   * Prépare les données du graphique linéaire pour un pays
   * @param country - Pays concerné
   */
  buildLineChartData(country: Olympic): LineChartData {
    return {
      name: country.country,
      series: country.participations.map(p => ({
        name: p.year.toString(),
        value: p.medalsCount,
      })),
    };
  }

  /**
   * Calcule le nombre total de pays et de JOs
   * @param olympics - Liste des pays
   */
  calculateTotals(olympics: Olympic[]): { totalCountries: number; totalJOs: number } {
    const totalCountries = olympics.length;
    const allParticipations = olympics.flatMap(o => o.participations);
    const uniqueYears = new Set(allParticipations.map(p => p.year));
    return { totalCountries, totalJOs: uniqueYears.size };
  }

  /**
   * Prépare les données du graphique en camembert pour l'accueil
   * @param olympics - Liste des pays
   */
  buildChartData(olympics: Olympic[]): ChartData[] {
    return olympics.map(o => ({
      name: o.country,
      value: o.participations.reduce((sum, p) => sum + p.medalsCount, 0),
    }));
  }
}

