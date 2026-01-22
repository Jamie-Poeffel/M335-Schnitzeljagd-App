import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-charging',
  standalone: true,
  templateUrl: './charging.page.html',
  styleUrls: ['./charging.page.scss'],
  imports: [CommonModule, IonicModule, RouterLink, ButtonComponent],
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
