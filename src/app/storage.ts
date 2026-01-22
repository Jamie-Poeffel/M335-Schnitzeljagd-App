import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  async setObject(key: string, value: object) {
    await Preferences.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  async getObject(key: string) {
    const ret = await Preferences.get({ key });
    const value = JSON.parse(ret.value!);

    return value;
  }
}
