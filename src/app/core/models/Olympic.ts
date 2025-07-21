import { Participation } from './Participation';

/**
 * Modèle décrivant un pays et l'ensemble de ses participations.
 */

export interface Olympic {
  id: number;                      // Identifiant unique du pays
  country: string;                 // Nom du pays
  participations: Participation[]; // Liste des participations aux différentes éditions
}