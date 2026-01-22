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
  },
  {
    path: 'maps',
    loadComponent: () => import('./maps/maps.page').then( m => m.MapsPage)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'qr-scanner',
    loadComponent: () => import('./qr-scanner/qr-scanner.page').then( m => m.QrScannerPage)
  },
  {
    path: 'rotate',
    loadComponent: () => import('./rotate/rotate.page').then( m => m.RotatePage)
  },
  {
    path: 'speedometer',
    loadComponent: () => import('./speedometer/speedometer.page').then( m => m.SpeedoMeterPage)
  },


];
