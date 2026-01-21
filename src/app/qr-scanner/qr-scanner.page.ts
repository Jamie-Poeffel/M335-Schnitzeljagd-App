// qr.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-qr',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonComponent,
  ],
})
export class QrScannerPage implements OnInit {
  timeLeft = '1 Tag';
  reward = 6;

  status: 'Ready' | 'Scanning' | 'Success' | 'Error' = 'Ready';
  lastResult = '';

  constructor() {}

  ngOnInit() {}

  onSkip() {
    console.log('skip');
  }

  onScanMock() {
    this.status = 'Scanning';

    setTimeout(() => {
      this.lastResult = 'demo:QR-CODE-12345';
      this.status = 'Success';
      console.log('scan result:', this.lastResult);
    }, 700);
  }
}
