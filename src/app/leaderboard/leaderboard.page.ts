import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { LeaderboardService } from '../leaderboard.service';
import { HuntProgressService } from '../hunt-progress-service';

@Component({
  standalone: true,
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  imports: [CommonModule, RouterLink, IonContent, ButtonComponent],
})
export class LeaderboardPage {
  private router = inject(Router);
  private lb = inject(LeaderboardService);
  private progress = inject(HuntProgressService);

  sending = false;
  sent = false;
  error: string | null = null;

  // Call this when you arrive on the page OR on button click
  async ionViewWillEnter() {
    // optional: auto-send once, comment out if you want manual
    // await this.submitRun();
  }

  async submitRun() {
    if (this.sending || this.sent) return;

    this.sending = true;
    this.sent = false;
    this.error = null;

    try {
      const name = localStorage.getItem('user_name') || 'Gast';

      const schnitzel = this.progress.getTotalSchnitzelOwned();
      const potato = this.progress.getTotalPotatoesOwned();

      // if you have a total runtime stored somewhere, use that.
      // For now: sum of all task seconds
      const totalSeconds = this.progress
        .getResults()
        .reduce((sum, r) => sum + (r.secondsTaken || 0), 0);

      const time = this.secondsToHms(totalSeconds);

      await this.lb.submitRun({
        name,
        schnitzel,
        potato,
        time,
      });

      this.sent = true;
    } catch (e) {
      console.log(e);
      this.error = 'Senden fehlgeschlagen. Versuch es erneut.';
    } finally {
      this.sending = false;
    }
  }

  startNewRun() {
    this.router.navigateByUrl('/accept-cam-loc');
  }

  private secondsToHms(totalSeconds: number) {
    const safe = Math.max(0, Math.floor(totalSeconds || 0));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;
    return { hours, minutes, seconds };
  }
}
