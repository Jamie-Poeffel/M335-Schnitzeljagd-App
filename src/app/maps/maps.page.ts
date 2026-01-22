import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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

import { HuntProgressService } from '../hunt-progress-service';
import { TimeService } from '../time';

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
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonComponent,
  ],
})
export class MapsPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private progress = inject(HuntProgressService);
  private time = inject(TimeService);

  private readonly TASK_INDEX = 1; // maps task = 1

  // Target destination
  readonly TARGET_LATITUDE = 47.027369922645896;
  readonly TARGET_LONGITUDE = 8.30021649416533;
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

  ngOnInit() {
    // start task timer + start tracking
    this.time.start(this.TASK_INDEX);
    this.initializeLocationTracking();
  }

  ngOnDestroy() {
    this.stopLocationTracking();
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
        }
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
    if (!position?.coords) return;

    this.userLatitude = position.coords.latitude;
    this.userLongitude = position.coords.longitude;
    this.locationError = null;
    this.calculateDistanceToTarget();
  }

  private handleLocationError(error: any) {
    this.isTrackingLocation = false;
    console.error('Location error:', error);

    this.locationError = error?.message
      ? `Standortfehler: ${error.message}`
      : 'Fehler beim Abrufen des Standorts.';
  }

  calculateDistanceToTarget() {
    if (this.userLatitude === null || this.userLongitude === null) return;

    const EARTH_RADIUS_METERS = 6371e3;

    const userLatRad = this.degreesToRadians(this.userLatitude);
    const targetLatRad = this.degreesToRadians(this.TARGET_LATITUDE);
    const dLat = this.degreesToRadians(this.TARGET_LATITUDE - this.userLatitude);
    const dLon = this.degreesToRadians(this.TARGET_LONGITUDE - this.userLongitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLatRad) * Math.cos(targetLatRad) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    this.distanceToTarget = Math.round(EARTH_RADIUS_METERS * c);
    this.isWithinTargetDistance = this.distanceToTarget <= this.TARGET_DISTANCE_THRESHOLD;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
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

  // ✅ completes task + stores schnitzel/potato + navigates
  private finishTaskAndGoNext() {
    const secondsTaken = this.time.stop(this.TASK_INDEX);
    this.progress.completeTask(this.TASK_INDEX, secondsTaken);
    this.router.navigate(['/qr-scanner']);
  }

  onContinue() {
    this.finishTaskAndGoNext();
  }

  onSkip() {
    this.finishTaskAndGoNext();
  }
}
