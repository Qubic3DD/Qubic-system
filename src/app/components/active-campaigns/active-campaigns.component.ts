import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-active-campaigns',
  imports: [],
  templateUrl: './active-campaigns.component.html',
  styleUrl: './active-campaigns.component.css'
})
export class ActiveCampaignsComponent {
  @Input() activeCampaigns: any;
  @Input() recentAlerts: any;




}
