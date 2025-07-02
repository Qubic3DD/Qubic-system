import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-advertiser',
  standalone: true,
  templateUrl: './view-advertiser-owner.component.html',
  styleUrls: ['./view-advertiser-owner.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule
  ]
})
export class ViewAdvertiserComponentDetatils implements OnInit {
  advertiser: any | null = null;
  isLoading = true;
  error: string | null = null;
  activeTab: 'profile' | 'analytics' | 'documents' = 'profile';
  actionsMenuOpen = false; // Add this line to declare the missing property
  
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.fetchAdvertiser(email);
    } else {
      this.error = 'No user email found in storage';
      this.isLoading = false;
    }
  }

  fetchAdvertiser(email: string): void {
    this.isLoading = true;
    const encodedEmail = encodeURIComponent(email);
    this.http.get<any>(`https://backend.qubic3d.co.za/profile/retrieve/${encodedEmail}`).pipe(
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

  setActiveTab(tab: 'profile' | 'analytics' | 'documents'): void {
    this.activeTab = tab;
    if (tab === 'analytics') {
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

  getStatusColor(status: string | undefined): string {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}