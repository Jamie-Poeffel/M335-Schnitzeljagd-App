import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Schnitzel } from 'src/app/types/schnitzel';
import { ButtonComponent } from "src/app/button/button.component";

@Component({
  selector: 'app-schnitzel-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './schnitzel-card.component.html',
  styleUrls: ['./schnitzel-card.component.scss'],
})
export class SchnitzelCardComponent {
  @Input() schnitzel!: Schnitzel;
  @Output() start = new EventEmitter<Schnitzel>();

  get isImage(): boolean {
    const v = (this.schnitzel?.image ?? '').toLowerCase();
    return v.startsWith('http') || v.endsWith('.png') || v.endsWith('.jpg') || v.endsWith('.jpeg') || v.endsWith('.webp');
  }

  onStart() {
    this.start.emit(this.schnitzel);
  }
}
