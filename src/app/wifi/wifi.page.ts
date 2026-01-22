import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { ChargingPage } from '../charging/charging.page';
import { WelcomePage } from '../welcome/welcome.page';

@Component({
  selector: 'app-wifi',
  standalone: true,
  templateUrl: './wifi.page.html',
  styleUrls: ['./wifi.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    ButtonComponent,
    ChargingPage,
    WelcomePage,
  ],
})
export class WifiPage {
  // demo values (später ersetzt du das mit echten variablen)
  timeLeft = '8min 14 sek';
  schnitzelCount = 4;

  ssid = 'ICT-KR6';
  password = 'EF-3A-03-AF-08-53';

  connected = false;

  constructor(private router: Router) {}

  onCancel(): void {
    console.log('cancel');
    this.router.navigate(['/home']);
  }

  charging(): void {
    this.router.navigate(['/charging']);
  }

  welcome(): void {
    this.router.navigate(['/leaderboard']);
  }
  getSchnitzelCount(): number {
  return Number(localStorage.getItem('schnitzel_count') ?? 0);
}

addSchnitzel(amount: number = 1) {
  const current = this.getSchnitzelCount();
  localStorage.setItem('schnitzel_count', String(current + amount));
}
}
