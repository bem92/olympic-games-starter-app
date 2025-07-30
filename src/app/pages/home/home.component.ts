import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { ChartData } from 'src/app/core/models/ChartData';

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
  private readonly destroy$ = new Subject<void>();
  
  // Données olympiques
  public olympics: Olympic[] = [];
  
  // Statistiques globales
  public totalCountries = 0;
  public totalJOs = 0;
  
  // Données pour le graphique
  public chartData: ChartData[] = [];
  
  // États de l'interface
  public loading = true;
  public error = false;
  public errorMessage = '';

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
            const totals = this.olympicService.calculateTotals(data);
            this.totalCountries = totals.totalCountries;
            this.totalJOs = totals.totalJOs;
            this.chartData = this.olympicService.buildChartData(data);
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