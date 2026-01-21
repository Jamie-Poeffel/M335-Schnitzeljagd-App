import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../button/button.component";
import { IonicModule } from '@ionic/angular'
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule, ButtonComponent, FormsModule],
})
export class HomePage {
  private router = inject(Router);
  name: string = "";

  navigateToWelcome() {
    this.router.navigateByUrl('/welcome').then(res => console.log(res));
  }

}
