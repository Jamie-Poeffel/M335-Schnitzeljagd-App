import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./leaderboard/leaderboard.page').then((m) => m.LeaderboardPage),
  },  {
    path: 'maps',
    loadComponent: () => import('./maps/maps.page').then( m => m.MapsPage)
  },

];
