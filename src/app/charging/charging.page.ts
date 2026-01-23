import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { TimeService } from '../time';
import { Device } from '@capacitor/device';
import { Storage } from '../storage';
import { Haptics, NotificationType } from '@capacitor/haptics';

@Component({
  selector: 'app-charging',
  standalone: true,
  templateUrl: './charging.page.html',
  styleUrls: ['./charging.page.scss'],
  imports: [IonicModule, RouterLink, ButtonComponent],
})
export class ChargingPage implements OnInit {
  private router = inject(Router);
  private timeService = inject(TimeService);
  private storage = inject(Storage);

  timeLeft = '5:00';

  private readonly TASK_INDEX = 6;
  private readonly MAX_MINUTES = 5;
  private readonly REWARD_COUNT_ID = `rw_${this.TASK_INDEX}`;

  reward = '';

  isCharging = false;

  private chargingBuzzed = false;

  constructor() {}

  private async vibrateSuccess() {
    await Haptics.notification({ type: NotificationType.Success });
  }

  Timer() {
    setInterval(async () => {
      this.timeLeft = this.timeService.getTimeRemaining(
        this.TASK_INDEX,
        this.MAX_MINUTES,
      );

      await this.checkBatteryStatus();
    }, 1000);
  }

  async checkBatteryStatus() {
    try {
      const batteryStatus = await Device.getBatteryInfo();
      const previous = this.isCharging;

      this.isCharging = !!batteryStatus.isCharging;

      if (!previous && this.isCharging && !this.chargingBuzzed) {
        this.chargingBuzzed = true;
        await this.vibrateSuccess();
      }

      if (previous && !this.isCharging) {
        this.chargingBuzzed = false;
      }
    } catch (e) {
      console.error('Battery check failed:', e);
    }
  }

  ngOnInit() {
    this.timeService.start(this.TASK_INDEX);
    this.Timer();

    this.storage.getObject(this.REWARD_COUNT_ID).then((reward) => {
      this.reward = reward;
    });
  }

  onSkip() {
    this.router.navigateByUrl('congrats');
  }

  onEnd(): void {
    this.router.navigateByUrl('congrats');
  }

  getSchnitzelCount(): number {
    return Number(localStorage.getItem('schnitzelCount') ?? 0);
  }

  addSchnitzel(amount: number = 1) {
    const current = this.getSchnitzelCount();
    localStorage.setItem('schnitzelCount', String(current + amount));
  }
}
