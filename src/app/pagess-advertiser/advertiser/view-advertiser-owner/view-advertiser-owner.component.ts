import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
import { DriverProfile } from '../../../api/Response/interfaces';

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
  ]
})
export class ViewAdvertiserComponentDetatils implements OnInit {
  advertiser: any | null = null;
  isLoading = true;
  error: string | null = null;
  activeTab: 'profile' | 'analytics' | 'documents' = 'profile';
  activeTabIndex = 0;
  driver: DriverProfile | null = null;
  asvertiserId: number | null = null;

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

  Math = Math;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.fetchDriver(email);
      this.fetchAdvertiser(email);
    } else {
      this.error = 'No user email found in storage';
      this.isLoading = false;
    }
  }

  hasValidImageUrl(email: string): boolean {
    const url = this.getDocumentUrlByUsernameAndPurpose(email, 'PROFILE_PICTURE');
    return !!url && url.trim() !== '';
  }

  fetchpro(email: string): Observable<any> {
    return this.http.get<any>(
      `http://41.76.110.219:8443/profile/retrieve/${email}`
    );
  }

  fetchDriver(email: string): void {
    this.isLoading = true;
    const encodedEmail = encodeURIComponent(email);
    this.fetchpro(encodedEmail).pipe(
      catchError(error => {
        console.error('Error fetching driver:', error);
        this.error = `Failed to load driver profile ${email}`;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe((response: any | null) => {
      if (response && response.data) {
        this.driver = response.data;
        this.asvertiserId = response.data.id;
        console.log('Advertiser ID:', this.asvertiserId);
        this.isLoading = false;
      } else {
        this.error = 'No data received from server';
        this.isLoading = false;
      }
    });
  }

  getDocumentUrlByUsernameAndPurpose(username: string, purpose: string): string {
    if (!username || !purpose) return '';
    const encodedUsername = encodeURIComponent(username);
    const encodedPurpose = encodeURIComponent(purpose);
    return `http://41.76.110.219:8443/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
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
    this.http.get<any>(`http://41.76.110.219:8443/profile/retrieve/${encodedEmail}`).pipe(
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

  setActiveTab(index: number): void {
    this.activeTabIndex = index;
    const tabNames = ['profile', 'analytics', 'documents'];
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
}