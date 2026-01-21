import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
} from '@ionic/angular/standalone';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonicModule
  ],
})
export class LeaderboardPage implements OnInit {
  constructor() { }

  ngOnInit() { }
}
