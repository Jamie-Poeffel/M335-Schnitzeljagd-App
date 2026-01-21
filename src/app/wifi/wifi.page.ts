import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wifi',
  standalone: true,
  templateUrl: './wifi.page.html',
  styleUrls: ['./wifi.page.scss'],
  imports: [CommonModule, IonicModule],
})
export class WifiPage {
  // demo values (später ersetzt du das mit echten variablen)
  timeLeft = '8min 14 sek';
  schnitzelCount = 4;

  ssid = 'ICT-KR6';
  password = 'EF-3A-03-AF-08-53';

  connected = false;

  constructor(private router: Router) {}

  onSkip(): void {
    console.log('skip wifi');
    // z.B. this.router.navigate(['/maps']);
  }

  onCancel(): void {
    console.log('cancel');
    this.router.navigate(['/home']);
  }
}
