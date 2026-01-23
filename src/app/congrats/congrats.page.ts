import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { User } from 'src/app/types/user';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { ButtonComponent } from '../button/button.component';
import { HuntProgressService, TaskResult } from '../hunt-progress-service';

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

  user: User = {
    name: localStorage.getItem('user_name') || 'Gast',
  } as User;

  // ✅ only tasks that actually gave schnitzel
  rewardedTasks: TaskResult[] = this.progress
    .getResults()
    .filter(r => r.schnitzelEarned > 0);

  // totals from service (already persisted)
  totalSchnitzel = this.progress.getTotalSchnitzelOwned();
  totalPotatoes = this.progress.getTotalPotatoesOwned();

  // ✅ earned this run (sum, not just length in case you ever change rewards)
  earnedThisRun = this.rewardedTasks.reduce((sum, r) => sum + r.schnitzelEarned, 0);

  goLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  goNext() {
    this.router.navigate(['/welcome']);
  }
}
