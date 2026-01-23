import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { Router, RouterLink } from '@angular/router';
import { Geolocation, Position, PositionOptions } from '@capacitor/geolocation';
import { Haptics, NotificationType } from '@capacitor/haptics';

import { HuntProgressService } from '../hunt-progress-service';
import { TimeService } from '../time';
import { Storage } from '../storage';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
    RouterLink,
    ButtonComponent,
    CommonModule,
  ],
})
export class MapsPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private progress = inject(HuntProgressService);
  private time = inject(TimeService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private storage = inject(Storage);

  private readonly TASK_INDEX = 1;
  private readonly REWARD_COUNT_ID = `rw_${this.TASK_INDEX}`
  private readonly MAX_TIME = 5;

  reward = '';

  // Target destination
  readonly TARGET_LATITUDE = 47.02745752832616;
  readonly TARGET_LONGITUDE = 8.30138651362293;
  readonly TARGET_DISTANCE_THRESHOLD = 10; // meters

  userLatitude: number | null = null;
  userLongitude: number | null = null;

  distanceToTarget: number | null = null;
  geolocationWatchId: string | null = null;

  timeRemaining = '5:00';

  isTrackingLocation = false;
  locationError: string | null = null;
  permissionStatus: string = 'checking';

  isWithinTargetDistance = false;
  private intervalId: any;
  private _neededTime: number = 0;

  // damit es nicht bei jedem GPS update vibriert
  private reachedBuzzed = false;

  constructor() { }

  ngOnInit() {
    // start task timer + start tracking
    this.time.start(this.TASK_INDEX);
    this.Timer();

    this.storage.getObject(this.REWARD_COUNT_ID).then((reward) => { this.reward = reward || 0 });
    this.initializeLocationTracking();
  }

  ngOnDestroy() {
    this.stopLocationTracking();
  }

  Timer() {
    this.intervalId = setInterval(() => {
      this.timeRemaining = this.time.getTimeRemaining(this.TASK_INDEX, this.MAX_TIME);

      if (this.isWithinTargetDistance) {
        clearInterval(this.intervalId);
        this._neededTime = this.time.stop(this.TASK_INDEX);
      }
    }, 1000);
  }

  private async vibrateSuccess() {
    await Haptics.notification({ type: NotificationType.Success });
  }

  async initializeLocationTracking() {
    try {
      const permissionStatus = await Geolocation.checkPermissions();

      if (permissionStatus.location === 'granted') {
        this.permissionStatus = 'granted';
        await this.startLocationTracking();
      } else if (
        permissionStatus.location === 'prompt' ||
        permissionStatus.location === 'prompt-with-rationale'
      ) {
        const requestResult = await Geolocation.requestPermissions();

        if (requestResult.location === 'granted') {
          this.permissionStatus = 'granted';
          await this.startLocationTracking();
        } else {
          this.permissionStatus = 'denied';
          this.locationError =
            'Standortzugriff verweigert. Bitte aktivieren Sie die Standortberechtigung in den Einstellungen.';
        }
      } else {
        this.permissionStatus = 'denied';
        this.locationError =
          'Standortzugriff verweigert. Bitte aktivieren Sie die Standortberechtigung in den Einstellungen.';
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      this.locationError = 'Fehler beim Initialisieren der Standortverfolgung.';
    }
  }

  async startLocationTracking() {
    try {
      this.isTrackingLocation = true;
      this.locationError = null;

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      this.geolocationWatchId = await Geolocation.watchPosition(
        options,
        (position, error) => {
          if (error) {
            this.handleLocationError(error);
          } else if (position) {
            this.handleLocationUpdate(position);
          }
        },
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      this.locationError = 'Fehler beim Starten der Standortverfolgung.';
      this.isTrackingLocation = false;
    }
  }

  async stopLocationTracking() {
    if (this.geolocationWatchId !== null) {
      try {
        await Geolocation.clearWatch({ id: this.geolocationWatchId });
      } catch (error) {
        console.error('Error stopping location tracking:', error);
      }
      this.geolocationWatchId = null;
      this.isTrackingLocation = false;
    }
  }

  private handleLocationUpdate(position: Position | null) {
    if (!position || !position.coords) {
      console.warn('Invalid position data received');
      return;
    }

    // Run inside Angular zone to trigger automatic change detection
    this.ngZone.run(() => {
      this.userLatitude = position.coords.latitude;
      this.userLongitude = position.coords.longitude;
      this.locationError = null;

      // Always recalculate distance when position updates
      this.calculateDistanceToTarget();

      console.log('Location updated:', {
        latitude: this.userLatitude,
        longitude: this.userLongitude,
        accuracy: position.coords.accuracy,
        distance: this.distanceToTarget,
        withinRange: this.isWithinTargetDistance,
      });

      if (this.isWithinTargetDistance) {
        console.log('🎯 Target reached! Within threshold distance.');
      }

      this.cdr.detectChanges();
    });
  }

  private handleLocationError(error: any) {
    this.ngZone.run(() => {
      this.isTrackingLocation = false;
      console.error('Location error:', error);

      if (error?.message) {
        this.locationError = `Standortfehler: ${error.message}`;
      } else {
        this.locationError = 'Fehler beim Abrufen des Standorts.';
      }

      this.cdr.detectChanges();
    });
  }

  calculateDistanceToTarget() {
    if (this.userLatitude === null || this.userLongitude === null) {
      console.warn('Cannot calculate distance: coordinates not available');
      this.distanceToTarget = null;
      this.isWithinTargetDistance = false;
      this.reachedBuzzed = false; // reset
      return;
    }

    const EARTH_RADIUS_METERS = 6371e3;

    const userLatitudeRadians = this.degreesToRadians(this.userLatitude);
    const targetLatitudeRadians = this.degreesToRadians(this.TARGET_LATITUDE);
    const latitudeDifferenceRadians = this.degreesToRadians(
      this.TARGET_LATITUDE - this.userLatitude,
    );
    const longitudeDifferenceRadians = this.degreesToRadians(
      this.TARGET_LONGITUDE - this.userLongitude,
    );

    const haversineA =
      Math.sin(latitudeDifferenceRadians / 2) *
      Math.sin(latitudeDifferenceRadians / 2) +
      Math.cos(userLatitudeRadians) *
      Math.cos(targetLatitudeRadians) *
      Math.sin(longitudeDifferenceRadians / 2) *
      Math.sin(longitudeDifferenceRadians / 2);

    const haversineC =
      2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));

    this.distanceToTarget = Math.round(EARTH_RADIUS_METERS * haversineC);

    const previousStatus = this.isWithinTargetDistance;

    // Check if user is within target distance
    this.isWithinTargetDistance =
      this.distanceToTarget <= this.TARGET_DISTANCE_THRESHOLD;

    // OUTSIDE -> WITHIN (nur einmal vibrieren)
    if (!previousStatus && this.isWithinTargetDistance && !this.reachedBuzzed) {
      this.reachedBuzzed = true;
      this.vibrateSuccess();
    }

    // optional: wenn wieder raus, dann darf es später wieder buzz geben
    if (previousStatus && !this.isWithinTargetDistance) {
      this.reachedBuzzed = false;
    }
  }

  private degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  getFormattedDistance(): string {
    if (this.distanceToTarget === null) return 'Berechnung...';
    return `${this.distanceToTarget} m`;
  }

  getDistanceColorClass(): string {
    return this.isWithinTargetDistance ? 'greenline' : 'redline';
  }

  async retryLocationPermission() {
    this.locationError = null;
    await this.initializeLocationTracking();
  }

  private finishTaskAndGoNext(skip: boolean) {
    clearInterval(this.intervalId);
    this._neededTime = this.time.stop(this.TASK_INDEX);
    this.progress.setTime(300);
    this.progress.completeTask(this.TASK_INDEX, this._neededTime, skip ? false : true);
    this.router.navigate(['/qr-scanner']);
  }

  async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      this.handleLocationUpdate(position);
    } catch (error) {
      console.error('Error getting current position:', error);
      this.locationError = 'Fehler beim Abrufen der aktuellen Position.';
    }
  }

  onContinue() {
    this.finishTaskAndGoNext(false);
  }

  onSkip() {
    this.finishTaskAndGoNext(true);
  }

  getSchnitzelCount(): number {
    return Number(localStorage.getItem('schnitzel_count') ?? 0);
  }

  addSchnitzel(amount: number = 1) {
    const current = this.getSchnitzelCount();
    localStorage.setItem('schnitzel_count', String(current + amount));
  }
}
