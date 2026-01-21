import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [IonButton],
})
export class ButtonComponent implements OnInit {
  @Input() state: 'normal' | 'outline' = 'normal';
  @Input() label: string = 'Button';

  @Output() clicked = new EventEmitter<void>();

  constructor() { }
  ngOnInit() { }

  onClick() {
    this.clicked.emit();
  }
}
