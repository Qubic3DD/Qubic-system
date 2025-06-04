import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CampaignService } from '../../services/campaign.service';
import { Campaign } from '../../model/campaign.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../campaign/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
  ],
})
export class CampaignComponent implements OnInit {
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  loading = true;
  statusFilter: string = 'all';
  isMenuOpen: boolean = false;

  constructor(
    private campaignService: CampaignService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
  }

  loadCampaigns(): void {
    this.loading = true;
    this.campaignService.getAllCampaigns().subscribe({
      next: (response) => {
        this.campaigns = response.data;
        this.filterCampaigns();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching campaigns:', err);
        this.loading = false;
      },
    });
  }

  filterCampaigns(): void {
    if (this.statusFilter === 'all') {
      this.filteredCampaigns = [...this.campaigns];
    } else {
      const isActive = this.statusFilter === 'active';
      this.filteredCampaigns = this.campaigns.filter(
        (campaign) => campaign.active === isActive
      );
    }
  }

  addCampaign(): void {
    this.router.navigate(['/campaigns/new']);
  }

  viewCampaignDetails(campaignId: number): void {
    this.router.navigate(['/campaign', campaignId]);
  }

  editCampaign(campaignId: number): void {
    this.router.navigate(['/campaign/edit', campaignId]);
  }

  deleteCampaign(campaignId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Campaign',
        message: 'Are you sure you want to delete this campaign?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.campaignService.deleteCampaign(campaignId).subscribe({
          next: () => {
            this.loadCampaigns();
          },
          error: (err) => {
            console.error('Error deleting campaign:', err);
          },
        });
      }
    });
  }
}
