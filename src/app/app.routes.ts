import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'rotate',
    loadComponent: () => import('./rotate/rotate.page').then(m => m.RotatePage)
  },
  {
    path: 'speedometer',
    loadComponent: () => import('./speedometer/speedometer.page').then(m => m.SpeedoMeterPage)
  },
  {
    path: 'accept-cam-loc',
    loadComponent: () =>
      import('./accept-cam-loc/accept-cam-loc.page').then(
        (m) => m.AcceptCamLocPage,
      ),
  },
  {
    path: 'maps',
    loadComponent: () => import('./maps/maps.page').then((m) => m.MapsPage),
  },

  {
    path: 'leaderboard',
    loadComponent: () =>
      import('./leaderboard/leaderboard.page').then((m) => m.LeaderboardPage),
  },

  {
    path: 'qr-scanner',
    loadComponent: () =>
      import('./qr-scanner/qr-scanner.page').then((m) => m.QrScannerPage),
  },
  {
    path: 'wifi',
    loadComponent: () => import('./wifi/wifi.page').then(m => m.WifiPage)
  },

];
