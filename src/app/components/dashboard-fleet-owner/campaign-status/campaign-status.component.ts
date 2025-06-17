// campaign-status.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-campaign-status',
  templateUrl: './campaign-status.component.html',
  styleUrls: ['./campaign-status.component.css']
})
export class CampaignStatusComponent {
  @Input() activeCampaigns: number = 0;
  @Input() inactiveCampaigns: number = 0;
  @Input() totalCampaigns: number = 0;

  get activePercentage(): number {
    return this.totalCampaigns > 0 ? Math.round((this.activeCampaigns / this.totalCampaigns) * 100) : 0;
  }

  get inactivePercentage(): number {
    return this.totalCampaigns > 0 ? Math.round((this.inactiveCampaigns / this.totalCampaigns) * 100) : 0;
  }
}