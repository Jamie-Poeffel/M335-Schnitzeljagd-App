import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { User } from 'src/app/types/user';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { ButtonComponent } from '../button/button.component';
import { HuntProgressService } from '../hunt-progress-service';

@Component({
  selector: 'app-congrats',
  standalone: true,
  templateUrl: './congrats.page.html',
  styleUrls: ['./congrats.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    ButtonComponent,
  ],
})
export class CongratsPage {
  private progress = inject(HuntProgressService);
  private router = inject(Router);

  // 1..6 tasks (adjust if you use 4 tasks only)
  readonly totalTasks = 6;

  // fetch user from local storage
user: User = {
  name: localStorage.getItem('user_name') || 'Gast'
} as User;


  results = this.progress.getResults();
  totalSchnitzel = this.progress.getTotalSchnitzelOwned();
  totalPotatoes = this.progress.getTotalPotatoesOwned();

  // quick lookup for template
  getResult(taskIndex: number) {
    return this.results.find((r) => r.taskIndex === taskIndex);
  }

  goLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  goNext() {
    // go wherever you want after congratulations
    this.router.navigate(['/welcome']);
  }
}
