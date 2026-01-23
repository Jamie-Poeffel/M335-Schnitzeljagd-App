import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Network, ConnectionStatus } from '@capacitor/network';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { ButtonComponent } from '../button/button.component';
import { TimeService } from '../time';
import { Storage } from '../storage';
import { HuntProgressService } from '../hunt-progress-service';

@Component({
  selector: 'app-wifi',
  standalone: true,
  templateUrl: './wifi.page.html',
  styleUrls: ['./wifi.page.scss'],
  imports: [IonicModule, ButtonComponent, CommonModule],
})
export class WifiPage implements OnInit, OnDestroy {
  private time = inject(TimeService);
  private progress = inject(HuntProgressService);
  private toastCtrl = inject(ToastController);

  private readonly TASK_INDEX = 5;
  private readonly MAX_TIME = 5;

  timeLeft = '5:00';
  reward = this.progress.getTotalSchnitzelOwned();

  ssid = 'ICT-KR6';
  password = 'EF-3A-03-AF-08-53';

  connected = false;

  // für "nur einmal auslösen"
  private didShowConnectedToast = false;

  networkListener: any;
  intervalId: any;
  private _neededTime: number = 0;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) { }

  Timer() {
    setInterval(() => {
      this.timeLeft = this.time.getTimeRemaining(
        this.TASK_INDEX,
        this.MAX_TIME,
      );
    }, 1000);
  }

  private finishTaskAndGoNext(skip: boolean) {
    clearInterval(this.intervalId);
    this._neededTime = this.time.stop(this.TASK_INDEX);
    this.progress.setTime(300);
    this.progress.completeTask(this.TASK_INDEX, this._neededTime, skip ? false : true);
    this.router.navigate(['/charging']);
  }

  async ngOnInit() {
    this.time.start(this.TASK_INDEX);
    this.Timer();

    const status = await Network.getStatus();
    this.checkWifi(status);

    this.networkListener = await Network.addListener(
      'networkStatusChange',
      (status) => {
        this.ngZone.run(() => this.checkWifi(status));
      },
    );
  }

  ngOnDestroy() {
    this.networkListener?.remove();
  }

  checkWifi(status: ConnectionStatus) {
    const isWifi = status.connected && status.connectionType === 'wifi';

    this.connected = isWifi;

    // ✅ sobald verbunden (nur einmal): haptic + popup
    if (isWifi && !this.didShowConnectedToast) {
      this.didShowConnectedToast = true;
      this.triggerConnected();
    }

    // optional: wenn du willst, dass es bei disconnect wieder neu auslösen kann:
    // if (!isWifi) this.didShowConnectedToast = false;

    this.cdr.detectChanges();
  }

  private async triggerConnected() {
    // Haptic
    await Haptics.notification({ type: NotificationType.Success });

    // Popup (Toast)
    const toast = await this.toastCtrl.create({
      message: 'Yuhuii connected 🎉',
      duration: 1800,
      position: 'top',
    });
    await toast.present();
  }

  onSkip() {
    this.finishTaskAndGoNext(true);
  }

  onCancel() {
    this.router.navigate(['/leaderboard']);
  }

  onContinue() {
    this.finishTaskAndGoNext(false);
  }

  getSchnitzelCount(): number {
    return Number(localStorage.getItem('schnitzel_count') ?? 0);
  }

  addSchnitzel(amount: number = 1) {
    const current = this.getSchnitzelCount();
    localStorage.setItem('schnitzel_count', String(current + amount));
  }
}
