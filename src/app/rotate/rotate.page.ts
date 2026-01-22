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

  private readonly TASK_INDEX = 2; // rotate task = 2

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
    // timer starten, sobald page offen ist
    this.time.start(this.TASK_INDEX);

    // Sensor listener
    this.motionListener = await Motion.addListener('accel', (event) => {
      if (this.completed) return;

      const x = event.accelerationIncludingGravity?.x ?? 0;
      const y = event.accelerationIncludingGravity?.y ?? 0;

      // Querformat-Erkennung: x stark + dominiert y
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

  private finishTaskAndGoNext() {
    const secondsTaken = this.time.stop(this.TASK_INDEX);
    this.progress.completeTask(this.TASK_INDEX, secondsTaken);
    this.router.navigate(['/speedometer']);
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

    // optional: mini delay für "Erledigt" anzeigen
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
