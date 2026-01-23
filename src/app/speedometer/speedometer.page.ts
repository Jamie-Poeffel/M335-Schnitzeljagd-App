import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { Geolocation, Position } from '@capacitor/geolocation';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

import { ButtonComponent } from '../button/button.component';
import { HuntProgressService } from '../hunt-progress-service';
import { TimeService } from '../time';
import { Storage } from '../storage';

type Fix = {
  lat: number;
  lng: number;
  timeMs: number;
};

@Component({
  selector: 'app-speedometer',
  standalone: true,
  templateUrl: './speedometer.page.html',
  styleUrls: ['./speedometer.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    ButtonComponent,
  ],
})
export class SpeedoMeterPage implements OnInit {
  // ===== injected services =====
  private progress = inject(HuntProgressService);
  private time = inject(TimeService);
  private router = inject(Router);
  private storage = inject(Storage);

  private readonly TASK_INDEX = 3;
  private readonly MAX_TIME = 10;
  private readonly REWARD_COUNT_ID = `rw_${this.TASK_INDEX}`;

  // ===== UI data =====
  title = 'Jagd das Schwein';
  timeLeft = '10:00';
  reward = '';

  taskTitle = 'Renne 12km/h';
  taskDesc = 'Renne 12km/h in einer geraden Linie';

  currentSpeed = '0.0'; // km/h

  // ===== mission status =====
  status: 'Ready' | 'Running' | 'Success' = 'Ready';

  // speed goal logic
  private readonly TARGET_KMH = 12;
  private readonly HOLD_MS = 1500; // must hold 12 km/h for 1.5s
  private successGiven = false;
  private holdStartMs: number | null = null;

  // ===== intern =====
  private watchId: string | null = null;
  private lastFix: Fix | null = null;

  // Filter, damit es nicht komplett rumzappelt
  private lastShownKmh = 0;

  Timer() {
    setInterval(() => {
      this.timeLeft = this.time.getTimeRemaining(
        this.TASK_INDEX,
        this.MAX_TIME,
      );
    }, 1000);
  }

  ngOnInit() {
    this.time.start(this.TASK_INDEX);
    this.Timer();

    this.storage.getObject(this.REWARD_COUNT_ID).then((reward) => {
      this.reward = reward;
    });
  }

  // ===== strong buzz when success =====
  private async strongBuzz() {
    // “stärker” als notification alleine:
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await Haptics.notification({ type: NotificationType.Success });
  }

  async ionViewWillEnter() {
    // Permissions
    await Geolocation.requestPermissions();

    // Optional: warm up
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      this.lastFix = this.toFix(pos);
    } catch {
      // ignore
    }

    // Live tracking starten
    this.watchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
      (pos, err) => {
        if (err || !pos) return;
        if (this.successGiven) return;

        const nowFix = this.toFix(pos);

        // 1) OS speed (m/s -> km/h)
        let kmh: number | null = null;
        const speedMs = pos.coords.speed; // number | null
        if (typeof speedMs === 'number' && isFinite(speedMs) && speedMs >= 0) {
          kmh = speedMs * 3.6;
        }

        // 2) Fallback: Distanz / Zeit
        if (kmh == null && this.lastFix) {
          const dtSec = (nowFix.timeMs - this.lastFix.timeMs) / 1000;
          if (dtSec >= 0.8) {
            const meters = this.haversineMeters(
              this.lastFix.lat,
              this.lastFix.lng,
              nowFix.lat,
              nowFix.lng,
            );
            const ms = meters / dtSec;
            kmh = ms * 3.6;
          }
        }

        // lastFix updaten
        this.lastFix = nowFix;

        if (kmh == null || !isFinite(kmh)) return;

        // clamp gegen GPS-Spikes
        kmh = Math.max(0, Math.min(kmh, 60));

        // smoothing
        const smooth = kmh; // du kannst hier auch mitteln, ich lass es simpel
        this.lastShownKmh = smooth;

        this.currentSpeed = smooth.toFixed(1);

        // status fürs UI
        if (this.status !== 'Success') {
          this.status = smooth >= 0.5 ? 'Running' : 'Ready';
        }

        // ===== SUCCESS LOGIC: 12 km/h halten =====
        const now = Date.now();

        if (smooth >= this.TARGET_KMH) {
          if (this.holdStartMs == null) this.holdStartMs = now;

          const heldFor = now - this.holdStartMs;
          if (heldFor >= this.HOLD_MS) {
            this.onSpeedSuccess();
          }
        } else {
          // zu langsam -> reset hold
          this.holdStartMs = null;
        }
      },
    );
  }

  private async onSpeedSuccess() {
    if (this.successGiven) return;
    this.successGiven = true;

    this.status = 'Success';

    // strong buzz
    await this.strongBuzz();

    // reward + progress speichern
    this.addSchnitzel(1);

    const t = this.time.stop(this.TASK_INDEX);
    this.progress.completeTask(this.TASK_INDEX, t);

    // optional: tracking stoppen, weil task done
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  ionViewWillLeave() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  onMoveOn() {
    // falls success schon passiert ist: einfach weiter
    // falls nicht: du erzwingst aktuell success -> das lassen wir wie bei dir
    if (!this.successGiven) {
      this.successGiven = true;

      this.addSchnitzel(1);

      const t = this.time.stop(this.TASK_INDEX);
      this.progress.completeTask(this.TASK_INDEX, t);
    }

    this.router.navigate(['/wifi']);
  }

  onSkip() {
    const t = this.time.stop(this.TASK_INDEX);
    this.progress.completeTask(this.TASK_INDEX, t);

    this.router.navigate(['/wifi']);
  }

  back() {
    history.back();
  }

  // ===== helper =====
  private toFix(pos: Position): Fix {
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      timeMs: pos.timestamp ?? Date.now(),
    };
  }

  private haversineMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000;
    const toRad = (v: number) => (v * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  getSchnitzelCount(): number {
    return Number(localStorage.getItem('schnitzel_count') ?? 0);
  }

  addSchnitzel(amount: number = 1) {
    const current = this.getSchnitzelCount();
    localStorage.setItem('schnitzel_count', String(current + amount));
  }
}
