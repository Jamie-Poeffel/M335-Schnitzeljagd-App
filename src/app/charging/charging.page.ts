import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { TimeService } from '../time';
import { Device } from '@capacitor/device';
import { Storage } from '../storage';
import { HuntProgressService } from '../hunt-progress-service';

@Component({
  selector: 'app-charging',
  standalone: true,
  templateUrl: './charging.page.html',
  styleUrls: ['./charging.page.scss'],
  imports: [IonicModule, RouterLink, ButtonComponent],
})
export class ChargingPage implements OnInit {
  private router = inject(Router);
  timeLeft = '5:00';
  private timeService = inject(TimeService);
  private storage = inject(Storage);
  private time = inject(TimeService);
  private progress = inject(HuntProgressService);

  private readonly TASK_INDEX = 6;
  private readonly MAX_MINUTES = 5;
  private readonly REWARD_COUNT_ID = `rw_${this.TASK_INDEX}`;
  private _neededTime: number = 0;

  intervalId: any;

  reward = ""

  Timer() {
    this.intervalId = setInterval(async () => {
      this.timeLeft = this.timeService.getTimeRemaining(
        this.TASK_INDEX,
        this.MAX_MINUTES,
      );
      this.checkBatteryStatus();
    }, 1000);
  }
  schnitzelCount = 5;

  async checkBatteryStatus() {
    const batteryStatus = await Device.getBatteryInfo();

    batteryStatus.isCharging
      ? (this.isCharging = true)
      : (this.isCharging = false);
  }

  // toggle this to see both designs
  isCharging = false;

  private finishTaskAndGoNext(skip: boolean) {
    clearInterval(this.intervalId);
    this._neededTime = this.time.stop(this.TASK_INDEX);
    this.progress.setTime(300);
    this.progress.completeTask(this.TASK_INDEX, this._neededTime, skip ? false : true);
    this.router.navigate(['/congrats']);
  }

  ngOnInit() {
    this.timeService.start(this.TASK_INDEX);
    this.Timer();
    this.storage.getObject(this.REWARD_COUNT_ID).then((reward) => { this.reward = reward });
  }

  onSkip() {
    this.finishTaskAndGoNext(true)
  }

  onEnd(): void {
    this.finishTaskAndGoNext(false);
  }
}
