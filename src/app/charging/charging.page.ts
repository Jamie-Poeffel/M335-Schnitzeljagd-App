import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { TimeService } from '../time';
import { Device } from '@capacitor/device';


@Component({
  selector: 'app-charging',
  standalone: true,
  templateUrl: './charging.page.html',
  styleUrls: ['./charging.page.scss'],
  imports: [IonicModule, RouterLink, ButtonComponent],
})
export class ChargingPage implements OnInit {
  private router = inject(Router);
  // demo values
  timeLeft = '5:00';
  private timeService = inject(TimeService);
  private readonly TASK_INDEX = 6;
  private readonly MAX_MINUTES = 5;

  Timer() {
    setInterval(async () => {
      this.timeLeft = this.timeService.getTimeRemaining(this.TASK_INDEX, this.MAX_MINUTES);
      this.checkBatteryStatus();
    }, 1000)
  }
  schnitzelCount = 5;

  async checkBatteryStatus() {
    const batteryStatus = await Device.getBatteryInfo();

    batteryStatus.isCharging ? this.isCharging = true : this.isCharging = false;
  }

  // toggle this to see both designs
  isCharging = false;

  ngOnInit() {
    this.timeService.start(this.TASK_INDEX);
    this.Timer()
  }

  onSkip() {
    this.router.navigateByUrl('congrats');
  }

  onEnd(): void {
    this.router.navigateByUrl('congrats');
  }
}
