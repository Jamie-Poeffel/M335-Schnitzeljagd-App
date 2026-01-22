import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { ButtonComponent } from '../button/button.component';

import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';

import { HuntProgressService } from '../hunt-progress-service';
import { TimeService } from '../time';

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
  private router = inject(Router);
  private progress = inject(HuntProgressService);
  private time = inject(TimeService);

  private readonly TASK_INDEX = 2;

  timeLeft = '1 Tag';
  reward = 6;

  status: 'Bereit' | 'Warten' | 'Erledigt' = 'Bereit';

  isUpsideDown = false;
  holdTime = 0;
  completed = false;

  readonly HOLD_DURATION = 5;

  phoneRotation = 0;

  private motionListener?: PluginListenerHandle;
  private holdInterval?: ReturnType<typeof setInterval>;

  async ngOnInit() {
    this.time.start(this.TASK_INDEX);

    this.motionListener = await Motion.addListener('accel', (event) => {
      if (this.completed) return;

      const x = event.accelerationIncludingGravity?.x ?? 0;
      const y = event.accelerationIncludingGravity?.y ?? 0;

      // 👉 Icon live rotieren lassen
      const angle = Math.atan2(y, x) * (180 / Math.PI);
      this.phoneRotation = angle - 90;

      // 👉 AUF KOPF erkennen (Y stark negativ)
      const upsideDownNow = y < -7 && Math.abs(y) > Math.abs(x);

      if (upsideDownNow !== this.isUpsideDown) {
        this.isUpsideDown = upsideDownNow;

        if (upsideDownNow) {
          this.status = 'Warten';
          this.startHoldTimer();
        } else {
          this.status = 'Bereit';
          this.resetHold();
        }
      }
    });
  }

  private finishTaskAndGoNext() {
    const secondsTaken = this.time.stop(this.TASK_INDEX);
    this.progress.completeTask(this.TASK_INDEX, secondsTaken);
  }

  onSkip() {
    this.finishTaskAndGoNext();
  }

  onDone() {
    if (!this.completed) return;
    this.finishTaskAndGoNext();
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
    if (this.holdInterval) {
      clearInterval(this.holdInterval);
      this.holdInterval = undefined;
    }
    this.holdTime = 0;
  }

  private completeTask() {
    if (this.holdInterval) {
      clearInterval(this.holdInterval);
      this.holdInterval = undefined;
    }

    this.completed = true;
    this.status = 'Erledigt';

    setTimeout(() => {
      this.finishTaskAndGoNext();
    }, 600);
  }

  get progressPercent() {
    return (this.holdTime / this.HOLD_DURATION) * 100;
  }

  ngOnDestroy() {
    this.motionListener?.remove();
    if (this.holdInterval) clearInterval(this.holdInterval);
  }
}
