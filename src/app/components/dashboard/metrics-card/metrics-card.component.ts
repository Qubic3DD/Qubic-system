// metrics-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  imports: [
    CommonModule, // <-- this is required
    // other imports
  ],
  selector: 'app-metrics-card',
  templateUrl: './metrics-card.component.html',
  styleUrls: ['./metrics-card.component.css']
})
export class MetricsCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() change: number = 0;
  @Input() icon: string = '';
  @Input() color: string = 'blue';
}