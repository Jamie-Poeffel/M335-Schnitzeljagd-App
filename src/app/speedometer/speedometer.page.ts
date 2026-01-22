// src/app/running/speedometer.page.ts
import { Component } from '@angular/core';
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
  // placeholders
  title = 'Jagd den Schwein';
  timeLeft = '10min 1 sek';
  reward = '3x';

  taskTitle = 'Renne 12km/h';
  taskDesc = 'Renne 12km/h in einer geraden Linie';
  currentSpeed = '2 km/h';

  skip() {
    console.log('skip');
  }

  back() {
    history.back();
  }
}
