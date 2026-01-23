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
import { HuntProgressService, TaskResult } from '../hunt-progress-service';
const LEADERBOARD_KEY = 'leaderboard_v1';

type LeaderboardEntry = {
  name: string;
  schnitzelEarnedRun: number;
  runtimeSeconds: number;
  finishedAt: number; 
};
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
    .filter((r) => r.schnitzelEarned > 0);

  // totals from service (already persisted)
  totalSchnitzel = this.progress.getTotalSchnitzelOwned();
  totalPotatoes = this.progress.getTotalPotatoesOwned();

  // ✅ earned this run (sum, not just length in case you ever change rewards)
  earnedThisRun = this.rewardedTasks.reduce(
    (sum, r) => sum + r.schnitzelEarned,
    0,
  );

  goLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  goBeginning() {
    this.router.navigate(['/home']);
  }
  private saveLeaderboardEntry() {
  const raw = localStorage.getItem(LEADERBOARD_KEY);
  const list: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];

  const entry: LeaderboardEntry = {
    name: this.user.name || 'Gast',
    schnitzelEarnedRun: this.earnedThisRun,
    runtimeSeconds: this.progress.getResults().reduce((sum, r) => sum + r.secondsTaken, 0),
    finishedAt: Date.now(),
  };

  list.push(entry);

  // sort: most schnitzels first, then fastest time
  list.sort((a, b) => {
    if (b.schnitzelEarnedRun !== a.schnitzelEarnedRun) {
      return b.schnitzelEarnedRun - a.schnitzelEarnedRun;
    }
    return a.runtimeSeconds - b.runtimeSeconds;
  });

  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
}
ionViewWillEnter() {
  this.saveLeaderboardEntry();
}
}
