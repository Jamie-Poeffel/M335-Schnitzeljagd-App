import { inject, Injectable } from '@angular/core';
import { Storage } from './storage';
import { h } from 'ionicons/dist/types/stencil-public-runtime';

export type TaskResult = {
  taskIndex: number;        // 1..6
  secondsTaken: number;
  schnitzelEarned: number;  // 1
  potatoEarned: number;     // 1 if > 300 sec
};

const KEY = 'hunt_progress_v1';

type State = {
  totalSchnitzelOwned: number;
  totalPotatoesOwned: number;
  results: TaskResult[];
};

@Injectable({ providedIn: 'root' })
export class HuntProgressService {
  private storageServie = inject(Storage);
  private state: State = this.load();
  private _time: number = 300;

  setTime(time: number) {
    this._time = time;
  }

  getTotalTime() {
    let totalSeconds = 0;

    this.state.results.forEach(r => {
      totalSeconds += r.secondsTaken;
    });

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return { h, m, s };
  }


  completeTask(taskIndex: number, secondsTaken: number, completed: boolean) {
    // prevent duplicates
    // if (this.state.results.some(r => r.taskIndex === taskIndex)) return;
    const schnitzelEarned = completed ? 1 : 0;
    const potatoEarned = secondsTaken > this._time ? 1 : 0; // > 5 min

    this.state.results.push({
      taskIndex,
      secondsTaken,
      schnitzelEarned,
      potatoEarned,
    });

    this.state.totalSchnitzelOwned += schnitzelEarned;
    this.state.totalPotatoesOwned += potatoEarned;

    this.save();
  }

  getResults(): TaskResult[] {
    return [...this.state.results].sort((a, b) => a.taskIndex - b.taskIndex);
  }

  getTotalSchnitzelOwned() {
    return this.state.totalSchnitzelOwned;
  }

  getTotalPotatoesOwned() {
    return this.state.totalPotatoesOwned;
  }

  private save() {
    this.storageServie.setObject(KEY, this.state).catch((e) => { console.log("error" + e) });
  }

  private load(): State {
    let raw;
    this.storageServie.getObject(KEY).then((obj) => { raw = obj });
    if (!raw) return { totalSchnitzelOwned: 0, totalPotatoesOwned: 0, results: [] };
    try {
      return raw as State;
    } catch {
      return { totalSchnitzelOwned: 0, totalPotatoesOwned: 0, results: [] };
    }
  }
}
