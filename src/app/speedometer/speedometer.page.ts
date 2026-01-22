// src/app/running/speedometer.page.ts
import { Component, inject } from '@angular/core';
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
import { HuntProgressService } from '../hunt-progress-service';
import { TimeService } from '../time';

@Component({
  selector: 'app-speedometer',
  standalone: true,
  templateUrl: './speedometer.page.html',
  styleUrls: ['./speedometer.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    ButtonComponent,
  ],
})
export class SpeedoMeterPage {
  // ===== injected services =====
  private progress = inject(HuntProgressService);
  private time = inject(TimeService);
  private router = inject(Router);

  // IMPORTANT: unique task number
  private readonly TASK_INDEX = 3; // maps=1, rotate=2, speedometer=3

  // ===== placeholders / UI data =====
  title = 'Jagd den Schwein';
  timeLeft = '10min 1 sek';
  reward = '3x';

  taskTitle = 'Renne 12km/h';
  taskDesc = 'Renne 12km/h in einer geraden Linie';
  currentSpeed = '2'; // km/h (placeholder)

  // ===== lifecycle =====
  ionViewWillEnter() {
    // start timer when page opens
    this.time.start(this.TASK_INDEX);
  }

  // ===== actions =====
  onSkip() {
    const time = this.time.stop(this.TASK_INDEX);
    this.progress.completeTask(this.TASK_INDEX, time);
    // go to next task
    this.router.navigate(['/wifi']);
  }

  back() {
    history.back();
  }
}
