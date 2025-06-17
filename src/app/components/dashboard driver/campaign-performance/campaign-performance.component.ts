// campaign-performance.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-campaign-performance',
  templateUrl: './campaign-performance.component.html',
  styleUrls: ['./campaign-performance.component.css'],
    imports: [CommonModule],
 
})
export class CampaignPerformanceComponent {
  @Input() totalCampaigns: number = 0;
  @Input() totalSavedCampaigns: number = 0;
  @Input() averageCampaignCompletionRate: number = 0;
  @Input() totalImpressions: number = 0;
  @Input() impressionsLast30Days: number = 0;
  @Input() totalAdsWatched: number = 0;
}