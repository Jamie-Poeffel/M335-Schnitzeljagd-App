// qr.page.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerScanResult, CapacitorBarcodeScannerTypeHintALLOption } from '@capacitor/barcode-scanner';


import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { TimeService } from '../time';
import { Storage } from '../storage';

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
    FormsModule,
    RouterLink,
    ButtonComponent,
  ],
})
export class QrScannerPage implements OnInit {
  private timeService = inject(TimeService);
  private router = inject(Router);
  private storage = inject(Storage);


  timeLeft = '10:00';

  private readonly TASK_INDEX = 1;
  private readonly MAX_TIME = 10;
  private readonly REWARD_COUNT_ID = `rw_${this.TASK_INDEX}`

  private readonly RESULT = "djsdgzoezkhdkdgvkiwehtiugfi";

  reward = this.storage.getObject(this.REWARD_COUNT_ID);

  Timer() {
    const intervalId = setInterval(() => {
      this.timeLeft = this.timeService.getTimeRemaining(this.TASK_INDEX, this.MAX_TIME);

      if (this.status == "Success") {
        this.timeService.stop(this.TASK_INDEX);

        this.timeLeft = this.timeService.getTimeRemaining(this.TASK_INDEX, this.MAX_TIME);

        clearInterval(intervalId);
      }
    }, 1000);
  }
  status: 'Ready' | 'Scanning' | 'Success' | 'Error' = 'Ready';
  lastResult = '';

  constructor() { }

  ngOnInit() {
    this.timeService.start(this.TASK_INDEX);
    this.Timer();
  }

  async scanQR() {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHintALLOption.ALL
    });

    if (result.ScanResult) {
      this.lastResult = result.ScanResult;
      if (this.lastResult === this.RESULT) {
        this.status = "Success";
        this.timeService.stop(this.TASK_INDEX);
      }
    }
  }


  onSkip() {
    this.router.navigateByUrl('rotate')
  }

  onMoveOn() {
    this.router.navigateByUrl('rotate')
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
