import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { LineChartData } from 'src/app/core/models/LineChartData';

/**
 * Page de détail présentant l'évolution des médailles d'un pays.
 */

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})

export class DetailComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  // Données du pays
  public countryData: Olympic | null = null;
  
  // Statistiques calculées
  public totalMedals = 0;
  public totalAthletes = 0;
  
  // Données pour le graphique
  public lineChartData: LineChartData[] = [];
  
  // États de l'interface
  public loading = true;
  public error = false;
  public errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly olympicService: OlympicService
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
                  const stats = this.olympicService.calculateCountryStats(country);
                  this.totalMedals = stats.totalMedals;
                  this.totalAthletes = stats.totalAthletes;
                  this.lineChartData = [this.olympicService.buildLineChartData(country)];
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
   * Navigation vers la page d'accueil
   */
  public goBack(): void {
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