# Olympic Games Dashboard

## Description

Application Angular responsive permettant de visualiser les données historiques des Jeux Olympiques. 
Cette application affiche les médailles par pays et permet de consulter le détail des performances de chaque nation.

## Installation

```bash
# Cloner le repository
git clone https://github.com/bem92/olympic-games-starter-app.git
cd olympic-games-starter-app

# Installer les dépendances
npm install -g @angular/cli
npm install --legacy-peer-deps

# Lancer l'application en mode développement
ng serve --host 0.0.0.0 --disable-host-check
```

L'application sera accessible à l'adresse : `http://localhost:4200`

## Fonctionnalités

- **Dashboard principal** : Visualisation du nombre total de médailles par pays (graphique camembert)
- **Page de détail** : Évolution des médailles d'un pays au fil des éditions (graphique linéaire)
- **Statistiques** : Nombre de JO, nombre de pays participants, nombre total d'athlètes
- **Responsive** : Application utilisable sur mobile et desktop

## Technologies utilisées

- Angular 18+
- TypeScript
- RxJS
- ngx-charts
- SCSS

## Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── models/         # Interfaces TypeScript
│   │   └── services/       # Services (HTTP, données)
│   ├── pages/
│   │   ├── home/          # Page d'accueil (dashboard)
│   │   ├── detail/        # Page de détail d'un pays
│   │   └── not-found/     # Page 404
│   └── app-routing.module.ts
├── assets/
│   └── mock/
│       └── olympic.json   # Données mockées
└── styles.scss            # Styles globaux
```