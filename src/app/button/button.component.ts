import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
  styleUrls: ['./button.component.scss'],
  imports: [IonButton],
})
export class ButtonComponent implements OnInit {
  @Input() state: 'normal' | 'outline' = 'normal';
  @Input() label: string = 'Button';
  @Input() children: HTMLElement | string = '';

  @Output() clicked = new EventEmitter<void>();

  constructor() {}
  ngOnInit() {}

  onClick() {
    this.clicked.emit();
  }
}
