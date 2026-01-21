import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';

import { ButtonComponent } from '../button/button.component';
=======
import { ButtonComponent } from "../button/button.component";
>>>>>>> d385935b4b7821f90bebe87830b3a422b24aa86e

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
<<<<<<< HEAD
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    ButtonComponent,
  ],
=======
  imports: [IonicModule, CommonModule, ButtonComponent],
>>>>>>> d385935b4b7821f90bebe87830b3a422b24aa86e
})
export class HomePage { }
