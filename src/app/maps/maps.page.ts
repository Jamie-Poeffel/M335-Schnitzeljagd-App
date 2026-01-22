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
  // Target destination (McDonald's in Lucerne)
  readonly TARGET_LATITUDE = 47.027369922645896;
  readonly TARGET_LONGITUDE = 8.30021649416533;
  readonly TARGET_DISTANCE_THRESHOLD = 10; // meters

  // User's current position
  userLatitude: number | null = null;
  userLongitude: number | null = null;

  // Distance to target in meters
  distanceToTarget: number | null = null;

  // Geolocation tracking identifier
  geolocationWatchId: string | null = null;

  // Timer display
  timeRemaining = '5:00';

  // Location tracking status
  isTrackingLocation = false;
  locationError: string | null = null;
  permissionStatus: string = 'checking';

  // Target reached status
  isWithinTargetDistance = false;

  constructor() { }

  ngOnInit() {
    this.initializeLocationTracking();
  }

  ngOnDestroy() {
    this.stopLocationTracking();
  }



  /**
   * Initialize location tracking with permission check
   */
  async initializeLocationTracking() {
    try {
      // Check current permission status
      const permissionStatus = await Geolocation.checkPermissions();
      console.log('Permission status:', permissionStatus);

      if (permissionStatus.location === 'granted') {
        this.permissionStatus = 'granted';
        await this.startLocationTracking();
      } else if (permissionStatus.location === 'prompt' || permissionStatus.location === 'prompt-with-rationale') {
        // Request permission
        const requestResult = await Geolocation.requestPermissions();
        console.log('Permission request result:', requestResult);

        if (requestResult.location === 'granted') {
          this.permissionStatus = 'granted';
          await this.startLocationTracking();
        } else {
          this.permissionStatus = 'denied';
          this.locationError = 'Standortzugriff verweigert. Bitte aktivieren Sie die Standortberechtigung in den Einstellungen.';
        }
      } else {
        this.permissionStatus = 'denied';
        this.locationError = 'Standortzugriff verweigert. Bitte aktivieren Sie die Standortberechtigung in den Einstellungen.';
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      this.locationError = 'Fehler beim Initialisieren der Standortverfolgung.';
    }
  }

  /**
   * Start tracking user's location in real-time
   */
  async startLocationTracking() {
    try {
      this.isTrackingLocation = true;
      this.locationError = null;

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      // Watch position changes
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

      console.log('Location tracking started with ID:', this.geolocationWatchId);
    } catch (error) {
      console.error('Error starting location tracking:', error);
      this.locationError = 'Fehler beim Starten der Standortverfolgung.';
      this.isTrackingLocation = false;
    }
  }

  /**
   * Stop tracking user's location
   */
  async stopLocationTracking() {
    if (this.geolocationWatchId !== null) {
      try {
        await Geolocation.clearWatch({ id: this.geolocationWatchId });
        console.log('Location tracking stopped');
      } catch (error) {
        console.error('Error stopping location tracking:', error);
      }
      this.geolocationWatchId = null;
      this.isTrackingLocation = false;
    }
  }

  /**
   * Handle successful location update
   */
  private handleLocationUpdate(position: Position | null) {
    if (!position || !position.coords) {
      return;
    }

    this.userLatitude = position.coords.latitude;
    this.userLongitude = position.coords.longitude;
    this.locationError = null;
    this.calculateDistanceToTarget();

    console.log('Location updated:', {
      latitude: this.userLatitude,
      longitude: this.userLongitude,
      accuracy: position.coords.accuracy,
      distance: this.distanceToTarget,
      withinRange: this.isWithinTargetDistance
    });
  }

  /**
   * Handle location tracking errors
   */
  private handleLocationError(error: any) {
    this.isTrackingLocation = false;

    console.error('Location error:', error);

    if (error.message) {
      this.locationError = `Standortfehler: ${error.message}`;
    } else {
      this.locationError = 'Fehler beim Abrufen des Standorts.';
    }
  }

  /**
   * Calculate distance from user to target using Haversine formula
   */
  calculateDistanceToTarget() {
    if (this.userLatitude === null || this.userLongitude === null) {
      return;
    }

    const EARTH_RADIUS_METERS = 6371e3;

    const userLatitudeRadians = this.degreesToRadians(this.userLatitude);
    const targetLatitudeRadians = this.degreesToRadians(this.TARGET_LATITUDE);
    const latitudeDifferenceRadians = this.degreesToRadians(this.TARGET_LATITUDE - this.userLatitude);
    const longitudeDifferenceRadians = this.degreesToRadians(this.TARGET_LONGITUDE - this.userLongitude);

    const haversineA =
      Math.sin(latitudeDifferenceRadians / 2) * Math.sin(latitudeDifferenceRadians / 2) +
      Math.cos(userLatitudeRadians) * Math.cos(targetLatitudeRadians) *
      Math.sin(longitudeDifferenceRadians / 2) * Math.sin(longitudeDifferenceRadians / 2);

    const haversineC = 2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));

    this.distanceToTarget = Math.round(EARTH_RADIUS_METERS * haversineC);

    // Check if user is within target distance
    this.isWithinTargetDistance = this.distanceToTarget <= this.TARGET_DISTANCE_THRESHOLD;
  }

  /**
   * Convert degrees to radians
   */
  private degreesToRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }

  /**
   * Format coordinates for display
   */
  getFormattedCoordinates(): string {
    if (this.userLatitude === null || this.userLongitude === null) {
      return 'Warte auf Standort...';
    }

    const latitudeDirection = this.userLatitude >= 0 ? 'N' : 'S';
    const longitudeDirection = this.userLongitude >= 0 ? 'E' : 'W';

    return `${Math.abs(this.userLatitude).toFixed(4)}° ${latitudeDirection}, ${Math.abs(this.userLongitude).toFixed(4)}° ${longitudeDirection}`;
  }

  /**
   * Get formatted distance string
   */
  getFormattedDistance(): string {
    if (this.distanceToTarget === null) {
      return 'Berechnung...';
    }
    return `${this.distanceToTarget} m`;
  }

  /**
   * Get distance text color class
   */
  getDistanceColorClass(): string {
    return this.isWithinTargetDistance ? 'greenline' : 'redline';
  }

  /**
   * Manually retry location permission request
   */
  async retryLocationPermission() {
    this.locationError = null;
    await this.initializeLocationTracking();
  }

  /**
   * Get current position once (not watching)
   */
  async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      this.handleLocationUpdate(position);
    } catch (error) {
      console.error('Error getting current position:', error);
      this.locationError = 'Fehler beim Abrufen der aktuellen Position.';
    }
  }

  /**
   * Handle continue button click
   */
  onContinue() {
    this.router.navigateByUrl('qr-scanner');
  }

  onSkip() {
    // später: navigation / next step
    console.log('skip');
  }
}