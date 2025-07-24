import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';

/**
 * Tableau de bord affichant les statistiques globales et le graphique
 * récapitulatif des médailles par pays.
 */

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Subject pour gérer la destruction des subscriptions
  private destroy$ = new Subject<void>();
  
  // Données olympiques
  olympics: Olympic[] = [];
  
  // Statistiques globales
  totalCountries = 0;
  totalJOs = 0;
  
  // Données pour le graphique
  chartData: { name: string; value: number }[] = [];
  
  // États de l'interface
  loading = true;
  error = false;
  errorMessage = '';

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOlympicData();
  }

  ngOnDestroy(): void {
    // Désabonnement automatique de tous les observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les données olympiques depuis le service
   */
  public loadOlympicData(): void {
    this.loading = true;
    this.error = false;
    
    this.olympicService.loadInitialData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.olympics = data;
            this.calculateStatistics();
            this.prepareChartData();
            this.loading = false;
          } else {
            this.handleError('Aucune donnée disponible');
          }
        },
        error: (err) => {
          this.handleError(err.message || 'Erreur lors du chargement des données');
        }
      });
  }

  /**
   * Calcule les statistiques globales
   */
  private calculateStatistics(): void {
    this.totalCountries = this.olympics.length;
    
    // Calcule le nombre total de JOs (toutes participations confondues)
    const allParticipations = this.olympics.flatMap(o => o.participations);
    
    // Obtient les années uniques pour compter le nombre de JOs
    const uniqueYears = new Set(allParticipations.map(p => p.year));
    this.totalJOs = uniqueYears.size;
  }

  /**
   * Prépare les données pour le graphique en camembert
   */
  private prepareChartData(): void {
    this.chartData = this.olympics.map(olympic => ({
      name: olympic.country,
      value: olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0)
    }));
  }

  /**
   * Gère la navigation lors du clic sur un segment du graphique
   * @param event - Événement contenant le nom du pays sélectionné
   */
  onSelect(event: { name: string }): void {
    const selectedOlympic = this.olympics.find(o => o.country === event.name);
    if (selectedOlympic) {
      this.router.navigate(['/detail', selectedOlympic.id]);
    }
  }

  /**
   * Gère les erreurs
   * @param message - Message d'erreur à afficher
   */
  private handleError(message: string): void {
    this.error = true;
    this.errorMessage = message;
    this.loading = false;
    console.error('Erreur dans HomeComponent:', message);
  }
}