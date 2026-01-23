import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {

  // ✅ Google Form POST endpoint (formResponse!)
  private readonly formUrl =
    'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc9v68rbCckYwcIekRLOaVZ0Qdm3eeh1xCEkgpn3d7pParfLQ/formResponse';

  async submitRun(run: {
    name: string;
    schnitzel: number;
    potato: number;
    time: { hours: number; minutes: number; seconds: number };
  }): Promise<void> {
    const url =
      'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc9v68rbCckYwcIekRLOaVZ0Qdm3eeh1xCEkgpn3d7pParfLQ/formResponse';
    const body =
      `entry.1860183935=${run.name}` + // Name
      `&entry.564282981=${run.schnitzel}` + // Schnitzel
      `&entry.1079317865=${run.potato}` + // Potatoes
      `&entry.985590604=${run.time.hours}:${run.time.minutes}:${run.time.seconds}`; // Duration
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' }


    await fetch(this.formUrl, {
      method: 'POST',
      mode: 'no-cors', // 🔥 REQUIRED for Google Forms
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    // no response, no json, no errors — Google Forms moment
  }
}
