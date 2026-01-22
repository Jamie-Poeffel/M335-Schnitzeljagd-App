import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimeService {
  private startTimes: Record<number, number> = {};

  start(taskIndex: number) {
    this.startTimes[taskIndex] = Date.now();
  }

  stop(taskIndex: number): number {
    const start = this.startTimes[taskIndex];
    if (!start) return 0;

    const seconds = Math.floor((Date.now() - start) / 1000);
    delete this.startTimes[taskIndex];
    return seconds;
  }
}
