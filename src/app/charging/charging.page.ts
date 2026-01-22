import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-charging',
  standalone: true,
  templateUrl: './charging.page.html',
  styleUrls: ['./charging.page.scss'],
  imports: [CommonModule, IonicModule, RouterLink],
})
export class ChargingPage {
  // demo values
  timeLeft = '7min 19 sek';
  schnitzelCount = 5;

  // toggle this to see both designs
  isCharging = false;

  onEnd(): void {
    console.log('End pressed');
  }
}
