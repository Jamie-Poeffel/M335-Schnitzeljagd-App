import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ButtonComponent } from '../button/button.component';

import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-rotate',
  templateUrl: './rotate.page.html',
  styleUrls: ['./rotate.page.scss'],
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
export class RotatePage implements OnInit, OnDestroy {
  timeLeft = '1 Tag';
  reward = 6;

  status: 'Bereit' | 'Warten' | 'Erledigt' = 'Bereit';

  isLandscape = false;
  holdTime = 0;
  completed = false;

  readonly HOLD_DURATION = 5;

  private motionListener?: PluginListenerHandle;
  private holdInterval?: ReturnType<typeof setInterval>;

  async ngOnInit() {
    this.motionListener = await Motion.addListener('accel', (event) => {
      if (this.completed) return;

      const x = event.accelerationIncludingGravity?.x ?? 0;
      const y = event.accelerationIncludingGravity?.y ?? 0;

      // Querformat-Erkennung
      const landscapeNow = Math.abs(x) > 7 && Math.abs(x) > Math.abs(y);

      if (landscapeNow !== this.isLandscape) {
        this.isLandscape = landscapeNow;

        if (landscapeNow) {
          this.status = 'Warten';
          this.startHoldTimer();
        } else {
          this.status = 'Bereit';
          this.resetHold();
        }
      }
    });
  }

  onDone() {
    if (!this.completed) return;
    console.log('Fertig → weiter');
  }

  private startHoldTimer() {
    if (this.holdInterval) return;

    this.holdInterval = setInterval(() => {
      this.holdTime = Math.min(this.holdTime + 0.1, this.HOLD_DURATION);

      if (this.holdTime >= this.HOLD_DURATION) {
        this.completeTask();
      }
    }, 100);
  }

  private resetHold() {
    clearInterval(this.holdInterval);
    this.holdInterval = undefined;
    this.holdTime = 0;
  }

  private completeTask() {
    clearInterval(this.holdInterval);
    this.holdInterval = undefined;

    this.completed = true;
    this.status = 'Erledigt';

    console.log('5 Sekunden gehalten ✅');
  }

  get progressPercent() {
    return (this.holdTime / this.HOLD_DURATION) * 100;
  }

  ngOnDestroy() {
    this.motionListener?.remove();
    clearInterval(this.holdInterval);
  }
}
