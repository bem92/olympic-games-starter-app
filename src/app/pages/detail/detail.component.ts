import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';

/**
 * Page de détail présentant l'évolution des médailles d'un pays.
 */

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})

export class DetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Données du pays
  countryData: Olympic | null = null;
  
  // Statistiques calculées
  totalMedals = 0;
  totalAthletes = 0;
  
  // Données pour le graphique
  lineChartData: any[] = [];
  
  // États de l'interface
  loading = true;
  error = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.loadCountryData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les données du pays depuis l'ID dans l'URL
   */
  private loadCountryData(): void {
    // Récupère l'ID depuis les paramètres de route
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(id)) {
      this.handleError('ID invalide');
      return;
    }

    // S'assure d'abord que les données sont chargées
    this.olympicService.loadInitialData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Puis récupère les données du pays spécifique
          this.olympicService.getOlympicById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (country) => {
                if (country) {
                  this.countryData = country;
                  this.calculateStatistics();
                  this.prepareChartData();
                  this.loading = false;
                } else {
                  this.handleError('Pays non trouvé');
                }
              },
              error: () => {
                this.handleError('Erreur lors du chargement des données du pays');
              }
            });
        },
        error: (err) => {
          this.handleError(err.message || 'Erreur lors du chargement des données');
        }
      });
  }

  /**
   * Calcule les statistiques totales du pays
   */
  private calculateStatistics(): void {
    if (!this.countryData) return;
    
    this.totalMedals = this.countryData.participations.reduce(
      (sum, p) => sum + p.medalsCount, 0
    );
    
    this.totalAthletes = this.countryData.participations.reduce(
      (sum, p) => sum + p.athleteCount, 0
    );
  }

  /**
   * Prépare les données pour le graphique linéaire
   */
  private prepareChartData(): void {
    if (!this.countryData) return;
    
    this.lineChartData = [{
      name: this.countryData.country,
      series: this.countryData.participations.map(p => ({
        name: p.year.toString(),
        value: p.medalsCount
      }))
    }];
  }

  /**
   * Navigation vers la page d'accueil
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Gère les erreurs
   * @param message - Message d'erreur à afficher
   */
  private handleError(message: string): void {
    this.error = true;
    this.errorMessage = message;
    this.loading = false;
    console.error('Erreur dans DetailComponent:', message);
  }
}