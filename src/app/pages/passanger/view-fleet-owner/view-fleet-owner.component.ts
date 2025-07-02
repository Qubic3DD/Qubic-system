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

import { ApiResponse } from '../../../api/Response/interfaces';
import { DriverProfile } from '../../../api/Response/FleetOwnersResponse';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-driver-profile',
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
    MatButtonModule
  ]
})
export class ViewPassengerComponent  implements OnInit {
  driver: any = null;
  isLoading = true;
  error: string | null = null;
  recentActivity: any[] = [];

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
        this.fetchPassenger(username);
        this.initializeCharts();
      } else {
        this.error = 'No username provided';
        this.isLoading = false;
      }
    });
  }
  revenueData = [
    {
      "name": "Jan",
      "value": 0
    },
    {
      "name": "Feb",
      "value": 0
    },
    {
      "name": "Mar",
      "value": 0
    },
    {
      "name": "Apr",
      "value": 0
    },
    {
      "name": "May",
      "value": 0
    },
    {
      "name": "Jun",
      "value": 0
    }
  ];

  driverStatusData = [
    {
      "name": "Active",
      "value": 0
    },
    {
      "name": "Inactive",
      "value": 0
    },
    {
      "name": "On Leave",
      "value": 0
    }
  ];
Math = Math;
  fetchPassenger(email: string): void {
    this.isLoading = true;
    const encodedEmail = encodeURIComponent(email);
    this.http.get<ApiResponse<DriverProfile>>(`https://backend.qubic3d.co.za/profile/retrieve/${encodedEmail}`).pipe(
      catchError(error => {
        console.error('Error fetching fleet owner:', error);
        this.error = `Failed to load fleet owner profile ${email}`;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response && response.data) {
        this.driver = response.data;
        this.initializeCharts();
        this.isLoading = false;
      } else {
        this.error = 'No data received from server';
        this.isLoading = false;
      }
    });
  }
  initializeCharts(): void {
    if (!this.driver) return;

    // Update revenue data
    this.revenueData = this.revenueData.map(item => ({
      ...item,
      value: Math.floor(Math.random() * 10000) + 1000
    }));

    // Initialize other chart data based on fleet owner data
    if (this.driver.revenue) {
      this.revenueData[this.revenueData.length - 1].value = this.driver.revenue;
    }
  }


fetchRecentActivity(driverId: string): void {
  this.http.get<any[]>(`https://backend.qubic3d.co.za/activity/${driverId}`)
    .pipe(
      catchError(() => of([]))
    )
    .subscribe(activity => {
      this.recentActivity = activity.slice(0, 5); // Show only 5 most recent
    });
}


  getDocumentUrlByUsernameAndPurpose(username: string, purpose: string): string {
    if (!username || !purpose) return '';
    const encodedUsername = encodeURIComponent(username);
    const encodedPurpose = encodeURIComponent(purpose);
    return `https://backend.qubic3d.co.za/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
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

  getActivityIcon(activityType: string): string {
    switch (activityType) {
      case 'login': return 'login';
      case 'trip': return 'directions_car';
      case 'document': return 'description';
      case 'update': return 'edit';
      default: return 'notifications';
    }
  }

  editDriver(driver: any): void {
    this.router.navigate(['/drivers/edit', driver.id]);
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
    this.router.navigate(['/drivers']);
  }
}