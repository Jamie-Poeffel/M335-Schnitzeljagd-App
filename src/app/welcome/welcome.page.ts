import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { USER } from 'src/app/data/user';
import { SCHNITZELS } from 'src/app/data/schnitzel';

import { Schnitzel } from 'src/app/types/schnitzel';
import { User } from 'src/app/types/user';

import { SchnitzelCardComponent } from 'src/app/components/schnitzel-card/schnitzel-card.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  imports: [
    CommonModule,
    IonicModule,
    SchnitzelCardComponent
  ],
})
export class WelcomePage {

  user: User = USER;                
  schnitzels: Schnitzel[] = SCHNITZELS;

  get initial(): string {           
    return this.user.name.charAt(0).toUpperCase();
  }

  startHunt(s: Schnitzel) {
    console.log('Starting hunt:', s.title);
  }
}
