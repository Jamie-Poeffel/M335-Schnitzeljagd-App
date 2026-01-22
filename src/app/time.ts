import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimeService {
  private startTimes: Record<number, number> = {};

  start(taskIndex: number) {
    this.startTimes[taskIndex] = Date.now();
  }

  getTimes() {
    return this.startTimes;
  }

  getTimeRemaining(taskIndex: number, maxTimeMin: number) {
    const startTime = Math.floor(this.startTimes[taskIndex]); // already ms
    const time = Math.floor(Date.now()); // already ms
    const maxTime = maxTimeMin * 60 * 1000; // ms

    const  timeInSeconds = ((startTime + maxTime) - time) / 1000;

    return this.convertTimeToString(timeInSeconds);
  }

  private convertTimeToString(timeInSeconds: number) {
    const min = Math.floor(timeInSeconds / 60);
    const sec = Math.floor(timeInSeconds % 60);

    const formattedSec = sec < 10 ? `0${sec}` : `${sec}`;
    return `${min}:${formattedSec}`;
  }



  stop(taskIndex: number): number {
    const start = this.startTimes[taskIndex];
    if (!start) return 0;

    const seconds = Math.floor((Date.now() - start) / 1000);
    this.startTimes[taskIndex] = seconds;

    return seconds;
  }
}
