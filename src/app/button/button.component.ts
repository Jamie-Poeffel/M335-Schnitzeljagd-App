import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
  styleUrls: ['./button.component.scss'],
  imports: [NgClass, IonicModule],
})
export class ButtonComponent implements OnInit {
  @Input() variant:
    | 'filled'
    | 'outline'
    | 'outline-icon'
    | 'text' = 'filled';

  @Output() clicked = new EventEmitter<void>();

  constructor() { }
  ngOnInit() { }

  onClick() {
    this.clicked.emit();
  }
}
