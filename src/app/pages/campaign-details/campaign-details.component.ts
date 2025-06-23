import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../model/campaign.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  templateUrl: './campaign-details.component.html',
  styleUrl: './campaign-details.component.css',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    CurrencyPipe
  ],
})
export class CampaignDetailsComponent implements OnInit {
  campaign?: Campaign;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.campaignService.getCampaignById(id).subscribe({
        next: (response) => {
          this.campaign = response.data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading campaign:', err);
          this.loading = false;
        },
      });
    }
  }

  getProgress(): number {
    if (!this.campaign) return 0;
    return (
      (this.campaign.accumulatedImpressions /
        this.campaign.requiredImpressions) *
      100
    );
  }

  getDaysRemaining(): number {
    if (!this.campaign) return 0;
    const endDate = new Date(this.campaign.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  hasTargetLocations(): boolean {
    return (this.campaign?.targetCities?.length || 0) + (this.campaign?.targetProvinces?.length || 0) > 0;
  }
}