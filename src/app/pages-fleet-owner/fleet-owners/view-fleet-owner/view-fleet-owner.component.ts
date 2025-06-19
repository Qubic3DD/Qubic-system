import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-view-fleet-owner',
  standalone: true,
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
    MatInputModule
  ]
})
export class ViewFleetOwnerComponent implements OnInit {
  userEmail: string | null = null;
  userName: string | null = null;
  userId: number | null = null;
  fleetOwner: FleetOwner | null = null;
  isLoading = true;
  error: string | null = null;
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
  yAxisLabel = 'Revenue';
  
  colorScheme = {
    name: 'myScheme',
    selectable: true,
    group: 'Ordinal',
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  revenueData = [
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
    private snackBar: MatSnackBar
  ) {
    this.userEmail = localStorage.getItem('userEmail');
    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('userName');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const username = this.userEmail;
      if (username) {
        this.fetchFleetOwner(username);
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
    return `${environment.api}files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  imageLoadFailed: { [email: string]: boolean } = {};

  onImageError(email: string) {
    this.imageLoadFailed[email] = true;
  }

  fetchFleetOwner(email: string): void {
    this.isLoading = true;
    const encodedEmail = encodeURIComponent(email);
    this.http.get<ApiResponse<FleetOwner>>(`${environment.api}profile/retrieve/${encodedEmail}`).pipe(
      catchError(error => {
        console.error('Error fetching fleet owner:', error);
        this.error = `Failed to load fleet owner profile ${email}`;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response && response.data) {
        this.fleetOwner = response.data;
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
    if (index === 1) { // Analytics tab
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 300);
    }
  }

  goBack(): void {
    this.router.navigate(['/fleet-owners']);
  }

  initializeCharts(): void {
    if (!this.fleetOwner) return;

    // Update revenue data
    this.revenueData = this.revenueData.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 10000) + 1000
    }));

    // Initialize other chart data based on fleet owner data
    if (this.fleetOwner.revenue) {
      this.revenueData[this.revenueData.length - 1].value = this.fleetOwner.revenue;
    }
  }

  editFleetOwner(fleetOwner: FleetOwner): void {
    this.router.navigate(['/fleet-owners/edit', fleetOwner.email]);
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
      case 'on leave': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getVehicleTypeColor(type: string): string {
    const colors: Record<string, string> = {
      'sedan': 'bg-purple-100 text-purple-800',
      'suv': 'bg-indigo-100 text-indigo-800',
      'truck': 'bg-orange-100 text-orange-800',
      'minibus': 'bg-teal-100 text-teal-800',
      'van': 'bg-amber-100 text-amber-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type.toLowerCase()] || colors['default'];
  }
}

interface ApiResponse<T> {
  token: string | null;
  data: T;
  message: string;
  timestamp: string;
}

interface FleetOwner {
  id: number;
  email: string;
  profile: string | null;
  phoneNo: string;
  userName: string;
  userHandle: string;
  roles: string[];
  firstName: string;
  lastName: string;
  gender: string | null;
  idNumber: string | null;
  licenseType: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  companyName: string | null;
  website: string | null;
  companyRegistrationNumber: string | null;
  companyType: string | null;
  taxNumber: string | null;
  vatRegistered: boolean;
  bio: string | null;
  disability: string | null;
  languages: string[];
  vehicleInformation: any[];
  uploadedDocuments: any[];
  username: string;
  idno: string | null;
  company: boolean;
  logo: string | null;
  status: string | null;
  revenue: number;
  numberOfVehicles: number;
  numberOfDrivers: number;
  fleetRating: number | null;
  activeContracts: number;
  availableVehicleTypes: string[];
  supportContact: string | null;
  preferredOperatingAreas: string[];
  lastActive: string | null;
  accountCreatedAt: string;
  accountUpdatedAt: string | null;
  documentsVerified: boolean;
  subscriptionPlan: string | null;
  subscriptionExpiry: string | null;
  vehicleCount: number | null;
}