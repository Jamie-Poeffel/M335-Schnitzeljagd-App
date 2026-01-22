import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-accept-cam-loc',
  standalone: true,
  templateUrl: './accept-cam-loc.page.html',
  styleUrls: ['./accept-cam-loc.page.scss'],
  imports: [CommonModule, IonicModule, RouterLink, ButtonComponent],
})
export class AcceptCamLocPage {
  camOk = false;
  locOk = false;

  toggleCam(): void {
    this.camOk = !this.camOk;
  }

  toggleLoc(): void {
    this.locOk = !this.locOk;
  }

  onStart(): void {
    if (!this.camOk || !this.locOk) return;
    console.log('Start hunt (permissions ok)');
    // später: router.navigate(['/maps']) oder so
  }
}
