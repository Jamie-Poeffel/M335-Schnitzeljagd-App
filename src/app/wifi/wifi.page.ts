import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Network, ConnectionStatus } from '@capacitor/network';
import { Haptics } from '@capacitor/haptics';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-wifi',
  standalone: true,
  templateUrl: './wifi.page.html',
  styleUrls: ['./wifi.page.scss'],
  imports: [CommonModule, IonicModule, ButtonComponent],
})
export class WifiPage implements OnInit, OnDestroy {
  timeLeft = '8min 14 sek';
  schnitzelCount = 4;

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
  ) {}

  async ngOnInit() {
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
}
