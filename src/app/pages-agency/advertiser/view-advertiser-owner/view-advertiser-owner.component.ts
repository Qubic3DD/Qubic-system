import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CampaignService } from '../../../services/campaign.service';
import { AdvertisersResponse } from '../../../api/Response/AdvertisersResponse';
import { Campaign } from '../../../model/campaign.model';
import { AddCampaignComponent } from '../../campaign/campaign/add-campaign/add-campaign.component';
import { CampaignComponent } from '../../campaign/campaign.component';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Pipe, PipeTransform } from '@angular/core';
import { TruncatePipe } from './truncate.pipe';
@Component({
  selector: 'app-view-advertiser',
  standalone: true,
  templateUrl: './view-advertiser-owner.component.html',
  styleUrls: ['./view-advertiser-owner.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    NgxChartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBar,
     TruncatePipe,
  ]
})
export class ViewAdvertiserComponent implements OnInit {
  advertiser: AdvertisersResponse | null = null;
  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];
  isLoading = true;
  error: string | null = null;
  activeTab: 'profile' | 'campaigns' | 'analytics' | 'documents' = 'profile';
  searchQuery = '';
  revenueChart: any;
  campaignStatusChart: any;
  activeTabIndex = 0;

  // Analytics data
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Impressions';
  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: 'Ordinal',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  impressionsData = [
    { "name": "Jan", "value": 0 },
    { "name": "Feb", "value": 0 },
    { "name": "Mar", "value": 0 },
    { "name": "Apr", "value": 0 },
    { "name": "May", "value": 0 },
    { "name": "Jun", "value": 0 }
  ];

  campaignStatusData = [
    { "name": "Active", "value": 0 },
    { "name": "Inactive", "value": 0 },
    { "name": "Completed", "value": 0 }
  ];

  Math = Math;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.fetchAdvertiser(username);
        this.fetchCampaigns();
      } else {
        this.error = 'No username provided';
        this.isLoading = false;
      }
    });
  }

  hasValidImageUrl(email: string): boolean {
    const url = this.getDocumentUrlByUsernameAndPurpose(email, 'PROFILE_PICTURE');
    return !!url && url.trim() !== '';
  }

  getDocumentUrlByUsernameAndPurpose(username: string, purpose: string): string {
    if (!username || !purpose) return '';
    const encodedUsername = encodeURIComponent(username);
    const encodedPurpose = encodeURIComponent(purpose);
    return `https://41.76.110.219:8443/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  imageLoadFailed: { [email: string]: boolean } = {};

  onImageError(email: string) {
    this.imageLoadFailed[email] = true;
  }

  fetchAdvertiser(email: string): void {
    this.isLoading = true;
    const encodedEmail = encodeURIComponent(email);
    this.http.get<ApiResponse<AdvertisersResponse>>(`https://41.76.110.219:8443/profile/retrieve/${encodedEmail}`).pipe(
      catchError(error => {
        console.error('Error fetching advertiser:', error);
        this.error = `Failed to load advertiser profile ${email}`;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response && response.data) {
        this.advertiser = response.data;
        this.initializeCharts();
        this.isLoading = false;
      } else {
        this.error = 'No data received from server';
        this.isLoading = false;
      }
    });
  }

  fetchCampaigns(): void {
    if (!this.advertiser?.id) return;
    
    this.isLoading = true;
    this.campaignService.getCampaignsByAdvertiserId(this.advertiser.id).pipe(
      map(response => response.data || []),
      tap(campaigns => {
        this.campaigns = campaigns;
        this.filteredCampaigns = [...campaigns];
        this.updateCampaignStatusChart(campaigns);
      }),
      catchError(error => {
        console.error('Error fetching campaigns:', error);
        this.error = 'Failed to load campaigns';
        return of([]);
      })
    ).subscribe(() => {
      this.isLoading = false;
    });
  }

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
    const tabNames = ['profile', 'campaigns', 'analytics', 'documents'];
    const activeTabName = tabNames[index] || 'profile';
    
    if (activeTabName === 'analytics') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }

  goBack(): void {
    this.router.navigate(['/advertisers']);
  }

  initializeCharts(): void {
    if (!this.advertiser) return;

    // Update impressions data
    this.impressionsData = this.impressionsData.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 10000) + 1000
    }));

    // Initialize other chart data based on advertiser data
    if (this.advertiser.revenue) {
      this.impressionsData[this.impressionsData.length - 1].value = this.advertiser.revenue;
    }
  }

  updateCampaignStatusChart(campaigns: Campaign[]): void {
    const statusCounts = {
      active: campaigns.filter(c => c.active).length,
      inactive: campaigns.filter(c => !c.active).length,
      completed: campaigns.filter(c => new Date(c.endDate) < new Date()).length
    };

    this.campaignStatusData = [
      { name: 'Active', value: statusCounts.active },
      { name: 'Inactive', value: statusCounts.inactive },
      { name: 'Completed', value: statusCounts.completed }
    ];
  }

  openAddCampaignDialog(advertiserId: number): void {
    const dialogRef = this.dialog.open(AddCampaignComponent, {
      width: '600px',
      data: { advertiserId: advertiserId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.fetchCampaigns();
      }
    });
  }

  filterCampaigns(): void {
    if (!this.searchQuery) {
      this.filteredCampaigns = [...this.campaigns];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredCampaigns = this.campaigns.filter(campaign =>
      campaign.name.toLowerCase().includes(query) ||
      campaign.description?.toLowerCase().includes(query) ||
      campaign.mediaFile?.name.toLowerCase().includes(query)
    );
  }

  viewCampaign(campaign: Campaign): void {
    this.dialog.open(CampaignComponent, {
      width: '800px',
      data: { campaign },
      panelClass: 'custom-dialog-container'
    });
  }

  editAdvertiser(advertiser: any) {
    this.router.navigate(['/advertisers/edit', advertiser.email]);
  }

  downloadDocument(documentId: string): void {
    this.snackBar.open('Downloading document...', 'Close', {
      duration: 2000
    });
  }

  getStatusColor(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getCampaignProgress(campaign: Campaign): number {
    if (!campaign.requiredImpressions) return 0;
    return Math.min(100, (campaign.accumulatedImpressions / campaign.requiredImpressions) * 100);
  }

  isCampaignActive(campaign: Campaign): boolean {
    const now = new Date();
    const startDate = new Date(campaign.startDate);
    const endDate = new Date(campaign.endDate);
    return campaign.active && now >= startDate && now <= endDate;
  }
}

interface ApiResponse<T> {
  token: string | null;
  data: T;
  message: string;
  timestamp: string;
}