// rotate.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

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
export class RotatePage implements OnInit {
  timeLeft = '1 Tag';
  reward = 6;

  status: 'Bereit' | 'Warten' | 'Erledigt' = 'Bereit';

  constructor() {}

  ngOnInit() {}

  onSkip() {
    console.log('überspringen');
  }

  onDone() {
    this.status = 'Warten';

    setTimeout(() => {
      this.status = 'Erledigt';
      console.log('gerät gedreht (mock)');
    }, 600);
  }
}
