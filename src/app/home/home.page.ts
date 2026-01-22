import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonComponent } from '../button/button.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule, ButtonComponent, FormsModule],
})
export class HomePage {
  private router = inject(Router);

  name: string = '';

  navigateToWelcome() {
    const cleaned = this.name.trim();

    if (!cleaned) {
      alert('Bitte gib einen Namen ein.');
      return;
    }

    localStorage.setItem('user_name', cleaned);
    this.router.navigateByUrl('/leaderboard');
  }
}
