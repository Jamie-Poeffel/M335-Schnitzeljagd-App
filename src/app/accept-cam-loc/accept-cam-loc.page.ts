import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { RouterLink } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ButtonComponent } from '../button/button.component';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { Camera } from '@capacitor/camera';

@Component({
  selector: 'app-accept-cam-loc',
  standalone: true,
  templateUrl: './accept-cam-loc.page.html',
  styleUrls: ['./accept-cam-loc.page.scss'],
  imports: [IonicModule, RouterLink, ButtonComponent],
})
export class AcceptCamLocPage implements OnInit {
  camOk = false;
  locOk = false;

  toggleCam(): void {
    this.checkLocationPermission(true).then((ok) => {
      this.locOk = ok;
    });
  }

  async openLocationSettings() {
    const platform = Capacitor.getPlatform();

    if (platform === 'android') {
      NativeSettings.openAndroid({
        option: AndroidSettings.ApplicationDetails,
      });
    } else if (platform === 'ios') {
      NativeSettings.openIOS({
        option: IOSSettings.App,
      });
    } else {
      console.log('Platform not supported or running in web');
    }
  }

  ngOnInit() {
    this.checkLocationPermission().then((ok) => {
      this.locOk = ok;
    });

    this.checkCameraPermission().then((ok) => {
      this.camOk = ok;
    });
  }

  async checkCameraPermission(prompt: boolean = false) {
    let perm = await Camera.checkPermissions();

    if (perm.camera === 'granted') {
      return true;
    }

    if (!prompt) {
      return false;
    }

    perm = await Camera.requestPermissions();

    if (perm.camera !== 'granted') {
      return false;
    }

    return true;
  }

  async checkLocationPermission(prompt: boolean = false): Promise<boolean> {
    const permissionStatus = await Geolocation.checkPermissions();

    if (permissionStatus.location === 'granted') {
      return true;
    }

    if (!prompt) {
      return false;
    }

    const perm = await Geolocation.requestPermissions();

    if (perm.location !== 'granted') {
      return false;
    }

    return true;
  }

  toggleLoc(): void {
    this.checkLocationPermission(true).then((ok) => {
      this.locOk = ok;
    });
  }

  onStart(): void {
    if (!this.camOk || !this.locOk) return;
    console.log('Start hunt (permissions ok)');
    // später: router.navigate(['/maps']) oder so
  }
}
