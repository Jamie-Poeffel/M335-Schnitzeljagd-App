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
  imports: [IonicModule, ButtonComponent, FormsModule],
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
<<<<<<< HEAD
    this.router.navigateByUrl('/leaderboard');
=======
    this.router.navigateByUrl('leaderboard');
>>>>>>> 036eda17811316f3a61f33825b84185bdafd5035
  }
}
