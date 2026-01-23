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

  private readonly TASK_INDEX = 4;
  private readonly MAX_TIME = 10;

  Timer() {
    this.intervalId = setInterval(() => {
      this.timeLeft = this.time.getTimeRemaining(this.TASK_INDEX, this.MAX_TIME)
    }, 1000);
  }

  ngOnInit() {
    this.time.start(this.TASK_INDEX);
    this.Timer();

  }

  // ===== UI data =====
  title = 'Jagd das Schwein';
  timeLeft = '10:00';
  reward = this.progress.getTotalSchnitzelOwned();

  taskTitle = 'Renne 12km/h';
  taskDesc = 'Renne 12km/h in einer geraden Linie';

  // in deinem Template ist es ein string -> lassen wir so
  currentSpeed = '0.0'; // km/h
  // ===== mission status =====
  status: 'Ready' | 'Running' | 'Success' = 'Ready';

  private _neededTime = 0;
  intervalId: any;

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

  async ionViewWillEnter() {
    // Permissions
    await Geolocation.requestPermissions();

    // Optional: einmalig aktuelle Position holen (warm up)
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

        const nowFix = this.toFix(pos);

        // 1) Wenn OS speed liefert: nehmen (m/s -> km/h)
        let kmh: number | null = null;
        const speedMs = pos.coords.speed; // number | null (m/s)
        if (typeof speedMs === 'number' && isFinite(speedMs) && speedMs >= 0) {
          kmh = speedMs * 3.6;
        }

        // 2) Fallback: speed selbst berechnen (Distanz / Zeit)
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

        // bisschen clampen gegen GPS-Spikes (optional)
        kmh = Math.max(0, Math.min(kmh, 60)); // 60 km/h cap fürs Rennen

        // simples smoothing (damit UI ruhiger ist)
        const smooth = Math.floor(kmh * 1.5); // m/s -> km/h
        this.lastShownKmh = smooth;

        this.currentSpeed = smooth.toFixed(1);
      },
    );
  }

  ionViewWillLeave() {
    // Watch stoppen
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  private finishTaskAndGoNext(skip: boolean) {
    clearInterval(this.intervalId);
    this._neededTime = this.time.stop(this.TASK_INDEX);
    this.progress.setTime(30);
    this.progress.completeTask(this.TASK_INDEX, this._neededTime, skip ? false : true);
    this.router.navigate(['/wifi']);
  }

  onSkip() {
    this.finishTaskAndGoNext(true);
  }

  onDone() {
    this.finishTaskAndGoNext(false);
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

  // Haversine Distanz in Metern
  private haversineMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000; // Earth radius in m
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
