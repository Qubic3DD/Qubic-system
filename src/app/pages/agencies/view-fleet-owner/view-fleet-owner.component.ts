import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgenciesResponse } from '../../../api/Response/AgenciesResponse';
import { MatChip, MatChipListbox } from '@angular/material/chips';

@Component({
  selector: 'app-agency-profile',
  templateUrl: './view-fleet-owner.component.html',
  styleUrls: ['./view-fleet-owner.component.css'],
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
    MatChipListbox,
    MatChip
  ]
})
export class ViewAgencyComponent implements OnInit {
  agency: AgenciesResponse | null = null;
  isLoading = true;
  advertisersLoading = false;
  error: string | null = null;
  recentActivity: any[] = [];
  showAdvertisers = false;
  advertisers: any[] = [];

  // Chart configurations
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  revenueData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 }
  ];
  agencyStatusData = [
    { name: 'Active', value: 0 },
    { name: 'Inactive', value: 0 },
    { name: 'On Leave', value: 0 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.fetchAgency(username);
      } else {
        this.error = 'No username provided';
        this.isLoading = false;
      }
    });
  }

  fetchAgency(email: string): void {
    this.isLoading = true;
    const encodedEmail = encodeURIComponent(email);
    this.http.get<any>(`https://41.76.110.219:8443/profile/retrieve/${encodedEmail}`).pipe(
      catchError(error => {
        console.error('Error fetching agency:', error);
        this.error = `Failed to load agency profile ${email}`;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response && response.data) {
        this.agency = response.data;
        this.initializeCharts();
        this.isLoading = false;
      } else {
        this.error = 'No data received from server';
        this.isLoading = false;
      }
    });
  }

  fetchAdvertisers(): void {
    if (!this.agency) return;
    // ?agencyId=${this.agency.id}
    this.advertisersLoading = true;
    this.http.get<any[]>(`https://41.76.110.219:8443/profile/advertisers`).pipe(
      catchError(error => {
        console.error('Error fetching advertisers:', error);
        this.snackBar.open('Failed to load advertisers', 'Close', { duration: 3000 });
        this.advertisersLoading = false;
        return of([]);
      })
    ).subscribe(advertisers => {
      this.advertisers = advertisers;
      this.advertisersLoading = false;
    });
  }

  toggleAdvertisers(): void {
    this.showAdvertisers = !this.showAdvertisers;
    if (this.showAdvertisers && this.advertisers.length === 0) {
      this.fetchAdvertisers();
    }
  }

  initializeCharts(): void {
    if (!this.agency) return;

    // Update revenue data with actual or random data
    this.revenueData = this.revenueData.map(item => ({
      ...item,
      value: this.agency?.revenue ? Math.floor(this.agency.revenue * Math.random()) : Math.floor(Math.random() * 10000) + 1000
    }));

    // Initialize status data
    this.agencyStatusData = [
      { name: 'Active', value: Math.floor(Math.random() * 50) + 30 },
      { name: 'Inactive', value: Math.floor(Math.random() * 20) + 5 },
      { name: 'On Leave', value: Math.floor(Math.random() * 10) + 1 }
    ];
  }

  calculateHoursPercentage(openTime: string, closeTime: string): number {
    // Simple calculation for demo purposes
    return 70; // Replace with actual calculation
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

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'on leave': return 'status-on-leave';
      default: return 'status-unknown';
    }
  }

  editAgency(agency: AgenciesResponse): void {
    this.router.navigate(['/agencies/edit', agency.id]);
  }

  downloadDocument(documentId: string): void {
    this.snackBar.open('Downloading document...', 'Close', { duration: 2000 });
    // Actual download implementation would go here
  }

  viewDocuments(): void {
    // Implement document viewing logic
  }

  viewActivity(): void {
    // Implement full activity view
  }

  downloadProfile(): void {
    this.snackBar.open('Exporting profile data...', 'Close', { duration: 2000 });
    // Implement profile export
  }

  goBack(): void {
    this.router.navigate(['/agencies']);
  }
}