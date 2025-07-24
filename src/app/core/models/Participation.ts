/**
 * Modèle représentant la participation d'un pays à une édition des Jeux.
 */
export interface Participation {
  id: number;           // Identifiant de la participation
  year: number;         // Année des JO
  city: string;         // Ville hôte
  medalsCount: number;  // Nombre de médailles gagnées
  athleteCount: number; // Nombre d'athlètes participants
}