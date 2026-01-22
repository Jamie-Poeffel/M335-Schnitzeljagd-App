// src/app/running/running.page.ts
import { Component } from '@angular/core';
import {
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

addIcons({ chevronBackOutline });

@Component({
  selector: 'app-speedometer',
  standalone: true,
  templateUrl: './speedometer.page.html',
  styleUrls: ['./speedometer.page.scss'],
  imports: [IonContent, IonButton, IonIcon],
})
export class SpeedoMeterPage {
  // placeholders
  title = 'Jagd den Schwein';
  timeLeft = '10min 1 sek';
  reward = '3x';
  taskTitle = 'Renne 12km/h';
  taskDesc = 'Renne 12km/h in einer geraden Linie';
  currentSpeed = '2km/h';

  // placeholder handlers
  skip() {
    console.log('skip');
  }

  back() {
    history.back();
  }
}
