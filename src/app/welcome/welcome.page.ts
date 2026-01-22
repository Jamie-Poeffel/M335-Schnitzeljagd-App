import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { SCHNITZELS } from 'src/app/data/schnitzel';
import { Schnitzel } from 'src/app/types/schnitzel';
import { User } from 'src/app/types/user';

import { SchnitzelCardComponent } from 'src/app/components/schnitzel-card/schnitzel-card.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  imports: [CommonModule, IonicModule, SchnitzelCardComponent],
})
export class WelcomePage {
  private router = inject(Router);

  // start with empty, then load from storage
  user: User = { id: 0, name: '' } as User;

  schnitzels: Schnitzel[] = SCHNITZELS;

  ionViewWillEnter() {
    const storedName = localStorage.getItem('user_name') || '';
    this.user.name = storedName || 'Gast';
  }

  get initial(): string {
    return (this.user.name?.charAt(0) || '?').toUpperCase();
  }

  startHunt(s: Schnitzel) {
    this.router.navigateByUrl('accept-cam-loc');
  }

  goToLeaderboards() {
    this.router.navigateByUrl('/leaderboard');
  }
}
