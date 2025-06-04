// ride-statistics.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ride-statistics',
  templateUrl: './ride-statistics.component.html',
  styleUrls: ['./ride-statistics.component.css'],
    imports: [CommonModule],
 
})
export class RideStatisticsComponent {
  @Input() totalRides: number = 0;
  @Input() averagePointsPerRide: number = 0;
  @Input() averageAdsPerRide: number = 0;
  @Input() totalPointsEarned: number = 0;
  @Input() totalDriverPoints: number = 0;
  @Input() totalDriverEarnings: number = 0;
}