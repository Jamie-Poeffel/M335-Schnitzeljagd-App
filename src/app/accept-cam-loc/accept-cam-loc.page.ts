import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { RouterLink } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-accept-cam-loc',
  standalone: true,
  templateUrl: './accept-cam-loc.page.html',
  styleUrls: ['./accept-cam-loc.page.scss'],
  imports: [CommonModule, IonicModule, RouterLink],
})
export class AcceptCamLocPage implements OnInit {
  camOk = false;
  locOk = false;

  toggleCam(): void {
    this.camOk = !this.camOk;
  }


  async openLocationSettings() {
    const platform = Capacitor.getPlatform();

    if (platform === 'android') {
      NativeSettings.openAndroid({
        option: AndroidSettings.Location
      });
    } else if (platform === 'ios') {
      NativeSettings.openIOS({
        option: IOSSettings.App
      });
    } else {
      console.log('Platform not supported or running in web');
    }
  }

  ngOnInit() {
    this.checkLocationPermission().then((ok) => {
      this.locOk = ok;
    });
  }

  checkCameraPermission(): void {

  }

  async checkLocationPermission(prompt: boolean = false): Promise<boolean> {
    const permissionStatus = await Geolocation.checkPermissions();

    if (permissionStatus.location === "granted") {
      return true;
    }

    if (!prompt) {
      return false;
    }

    if (permissionStatus.location !== "prompt") {
      this.openLocationSettings().then(async () => this.checkLocationPermission())
      return false;
    }

    return false;
  }

  toggleLoc(): void {
    this.checkLocationPermission().then((ok) => {
      this.locOk = ok;
    });
  }

  onStart(): void {
    if (!this.camOk || !this.locOk) return;
    console.log('Start hunt (permissions ok)');
    // später: router.navigate(['/maps']) oder so
  }
}
