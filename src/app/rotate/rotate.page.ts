// rotate.page.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

import { HuntProgressService } from '../hunt-progress-service';
import { TimeService } from '../time';

@Component({
  selector: 'app-rotate',
  templateUrl: './rotate.page.html',
  styleUrls: ['./rotate.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    FormsModule,
    RouterLink,
    ButtonComponent,
  ],
})
export class RotatePage implements OnInit {
  private router = inject(Router);
  private progress = inject(HuntProgressService);
  private time = inject(TimeService);

  private readonly TASK_INDEX = 2; // rotate task = 2

  timeLeft = '1 Tag';
  reward = 6;

  status: 'Bereit' | 'Warten' | 'Erledigt' = 'Bereit';

  ngOnInit() {
    // start timer when page opens
    this.time.start(this.TASK_INDEX);
  }

  private finishTaskAndGoNext() {
    const time = this.time.stop(this.TASK_INDEX);
    this.progress.completeTask(this.TASK_INDEX, time);
    this.router.navigate(['/speedometer']);
  }

  onSkip() {
    this.finishTaskAndGoNext();
  }

  onDone() {
    this.status = 'Warten';

    setTimeout(() => {
      this.status = 'Erledigt';
      // complete task + save rewards + go next
      this.finishTaskAndGoNext();
    }, 600);
  }
}
