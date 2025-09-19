import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards',
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  @Input() totalCampaigns: number | null = null;
  @Input() totalRevenueApprox: number | null = null;
  @Input() activeTablets: number | null = null;
  @Input() totalAdvertisers: number | null = null;
}
