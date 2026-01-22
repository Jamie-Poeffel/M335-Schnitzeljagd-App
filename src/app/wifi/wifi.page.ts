import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Network, ConnectionStatus } from '@capacitor/network';
import { Haptics } from '@capacitor/haptics';
import { ButtonComponent } from '../button/button.component';
import { TimeService } from '../time';
import { Storage } from '../storage';

@Component({
  selector: 'app-wifi',
  standalone: true,
  templateUrl: './wifi.page.html',
  styleUrls: ['./wifi.page.scss'],
  imports: [IonicModule, ButtonComponent],
})
export class WifiPage implements OnInit, OnDestroy {
  private time = inject(TimeService);
  private storage = inject(Storage);

  private readonly TASK_INDEX = 5;
  private readonly MAX_TIME = 5;
  private readonly REWARD_COUNT_ID = `rw_${this.TASK_INDEX}`

  timeLeft = '5:00';
  reward = "";

  ssid = 'ICT-KR6';
  password = 'EF-3A-03-AF-08-53';

  connected = false;
  hasConnected = false;
  isFinished = false;
  networkListener: any;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) { }

  Timer() {
    setInterval(() => {
      this.timeLeft = this.time.getTimeRemaining(this.TASK_INDEX, this.MAX_TIME);
    }, 1000);
  }

  async ngOnInit() {
    this.time.start(this.TASK_INDEX);
    this.Timer();
    this.storage.getObject(this.REWARD_COUNT_ID).then((reward) => { this.reward = reward });

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

    if (isWifi) {
      this.hasConnected = true;
    } else {
      if (this.hasConnected && !this.isFinished) {
        this.triggerSuccess();
      }
    }

    this.cdr.detectChanges();
  }

  async triggerSuccess() {
    this.isFinished = true;
    await Haptics.notification({ type: 'success' as any });
  }

  charging() {
    this.router.navigate(['/charging']);
  }

  welcome() {
    this.router.navigate(['/leaderboard']);
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
  onContinue() {
    this.router.navigate(['/charging']);
  }
  getSchnitzelCount(): number {
    return Number(localStorage.getItem('schnitzel_count') ?? 0);
  }

  addSchnitzel(amount: number = 1) {
    const current = this.getSchnitzelCount();
    localStorage.setItem('schnitzel_count', String(current + amount));
  }
}
