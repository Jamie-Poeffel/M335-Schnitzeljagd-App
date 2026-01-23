// qr.page.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerScanResult,
  CapacitorBarcodeScannerTypeHintALLOption,
} from '@capacitor/barcode-scanner';

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { TimeService } from '../time';
import { Storage } from '../storage';
import { HuntProgressService } from '../hunt-progress-service';

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
  private progress = inject(HuntProgressService);
  private time = inject(TimeService);

  timeLeft = '10:00';

  private readonly TASK_INDEX = 2;
  private readonly MAX_TIME = 10;
  private readonly REWARD_COUNT_ID = `rw_${this.TASK_INDEX}`;
  reward = '';

  intervalId: any;
  private _neededTime = 0;

  private readonly RESULT = "djsdgzoezkhdkdgvkiwehtiugfi";

  Timer() {
    this.intervalId = setInterval(() => {
      this.timeLeft = this.timeService.getTimeRemaining(this.TASK_INDEX, this.MAX_TIME);
    }, 1000);
  }

  status: 'Ready' | 'Scanning' | 'Success' | 'Error' = 'Ready';
  lastResult = '';

  constructor() { }

  ngOnInit() {
    this.timeService.start(this.TASK_INDEX);
    this.Timer();

    this.storage.getObject(this.REWARD_COUNT_ID).then((reward) => { this.reward = reward || 0 });
  }

  private async vibrateSuccess() {
    await Haptics.notification({ type: NotificationType.Success });
  }

  async scanQR() {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,
    });

    if (result.ScanResult) {
      this.lastResult = result.ScanResult;

      if (this.lastResult === this.RESULT) {
        this.status = "Success";
      }
    }
  }

  private finishTaskAndGoNext(skip: boolean) {
    clearInterval(this.intervalId);
    this._neededTime = this.time.stop(this.TASK_INDEX);
    this.progress.setTime(600);
    this.progress.completeTask(this.TASK_INDEX, this._neededTime, skip ? false : true);
    this.router.navigate(['/rotate']);
  }


  onSkip() {
    this.finishTaskAndGoNext(true)
  }

  onMoveOn() {
    this.finishTaskAndGoNext(false);
  }
}
