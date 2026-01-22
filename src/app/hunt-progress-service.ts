import { Injectable } from '@angular/core';

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
  private state: State = this.load();

  completeTask(taskIndex: number, secondsTaken: number) {
    // prevent duplicates
    if (this.state.results.some(r => r.taskIndex === taskIndex)) return;

    const schnitzelEarned = 1;
    const potatoEarned = secondsTaken > 300 ? 1 : 0; // > 5 min

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
    localStorage.setItem(KEY, JSON.stringify(this.state));
  }

  private load(): State {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { totalSchnitzelOwned: 0, totalPotatoesOwned: 0, results: [] };
    try {
      return JSON.parse(raw) as State;
    } catch {
      return { totalSchnitzelOwned: 0, totalPotatoesOwned: 0, results: [] };
    }
  }
}
