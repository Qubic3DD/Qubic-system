import { Component, Input, OnInit } from '@angular/core';
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
import { DriverService } from '../../services/DriverService';
import { catchError, Observable, of } from 'rxjs';
import { ApiResponse } from '../../api/Response/interfaceAproval';
import { DriverProfile } from '../../api/Response/interfaces';
import { HttpClient } from '@angular/common/http';
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
export class CampaignComponentAdvertiser implements OnInit {
  @Input() isCollapsed = false;
  userEmail: string | null = null;
  userName: string | null = null;

  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  loading = true;
  statusFilter: string = 'all';
  isMenuOpen: boolean = false;
  driver: DriverProfile | null = null;
  isLoading = true;
  error: string | null = null;
  recentActivity: any[] = [];
  asvertiserId: number | null =null;

  constructor(
    private campaignService: CampaignService,
    private router: Router,
    private dialog: MatDialog,
    private driverService: DriverService,
    private http: HttpClient
  ) {
    // Get user info from localStorage when component initializes
    this.userEmail = localStorage.getItem('userEmail');
    this.userName = localStorage.getItem('userName');
  }

  ngOnInit(): void {
    if (this.userEmail) {
      this.fetchDriver(this.userEmail);
    } else {
      this.error = 'No user email found';
      this.isLoading = false;
    }
  }
fetchpro(email: string): Observable<ApiResponse<DriverProfile>> {
    // Remove encodeURIComponent here - we'll do it in fetchDriver
    return this.http.get<ApiResponse<DriverProfile>>(
      `http://41.76.110.219:8443/profile/retrieve/${email}`
    );
}
fetchDriver(email: string): void {
    this.isLoading = true;
    const encodedEmail = encodeURIComponent(email); // Encode only once here
    this.fetchpro(encodedEmail).pipe(
      catchError(error => {
        console.error('Error fetching driver:', error);
        this.error = `Failed to load driver profile ${email}`;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe((response: ApiResponse<DriverProfile> | null) => {
      if (response && response.data) {
        this.driver = response.data;
        this.asvertiserId = response.data.id;
        console.log('Advertiser ID:', this.asvertiserId); // Debug print
        this.loadCampaigns();
        this.isLoading = false;
      } else {
        this.error = 'No data received from server';
        this.isLoading = false;
      }
    });
}
  loadCampaigns(): void {
    this.loading = true;
    this.campaignService.getCampaignsByAdvertiserId(this.asvertiserId!).subscribe({
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
    console.log('Attempting to navigate to add campaign'); // Add this
    this.router.navigate(['/advertiser-dashboard/add']);
}
  viewCampaignDetails(campaignId: number): void {
    this.router.navigate(['/advertiser-dashboard/view-campaign', campaignId]);
  }

  editCampaign(campaignId: number): void {
    this.router.navigate(['/campaign/edit', campaignId]);
  }

  deleteCampaign(campaignId: number,): void {
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

  clearFilters() {
    this.statusFilter = 'all';
    this.filterCampaigns();
  }
}
