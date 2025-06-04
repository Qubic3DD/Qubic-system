// vehicle-statistics.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vehicle-statistics',
  templateUrl: './vehicle-statistics.component.html',
  styleUrls: ['./vehicle-statistics.component.css']
})
export class VehicleStatisticsComponent {
  @Input() publicVehicles: number = 0;
  @Input() privateVehicles: number = 0;
  @Input() totalVehicles: number = 0;
}