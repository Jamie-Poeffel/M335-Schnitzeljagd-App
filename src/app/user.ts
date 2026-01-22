import { Injectable } from '@angular/core';

const KEY = 'user_name_v1';

@Injectable({ providedIn: 'root' })
export class UserService {
  getName(): string {
    return localStorage.getItem(KEY) || '';
  }

  setName(name: string) {
    localStorage.setItem(KEY, name.trim());
  }

  clearName() {
    localStorage.removeItem(KEY);
  }
}
