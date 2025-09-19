import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { BaseRequest } from '../../api/Request/base-request';
import { RequestSenderService } from '../../core/request-sender.service';
import { AgenciesResponse } from '../../api/Response/AgenciesResponse';
import { Services } from '../../core/services';
import { AdvertiserService } from '../../services/advertiser.service';
import { AdvertisersResponse } from '../../api/Response/AdvertisersResponse';

type Filter = {
  id: string;
  label: string;
  active: boolean;
};

@Component({
  selector: 'app-agencies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.css']
})
export class AgenciesComponent implements OnInit {
  _baseRequest: BaseRequest = new BaseRequest();
  agencies: AgenciesResponse[] = [];
  filteredAgencies: AgenciesResponse[] = [];
  activeFilter: string = 'all';
  isLoading: boolean = false;
  expandedAgencies: { [key: number]: boolean } = {};
  // KPI stats
  totalAgencies = 0;
  activeAgencies = 0;
  inactiveAgencies = 0;
  totalRevenue = 0;
  
  // Advertiser assignment
  showAssignAdvertiserModal: boolean = false;
  selectedAgency: AgenciesResponse | null = null;
  availableAdvertisers: any[] = [];
  selectedAdvertiserId: string = '';
    advertisers: AdvertisersResponse[] = [];


  filters: Filter[] = [
    { id: 'all', label: 'All', active: true },
    { id: 'active', label: 'Active', active: false },
    { id: 'inactive', label: 'Inactive', active: false },
    { id: 'premium', label: 'Premium', active: false }
  ];

  constructor(
    private router: Router,
    private _http: RequestSenderService,
    private http: HttpClient,
    private advertiserService: AdvertiserService
  ) {}

  ngOnInit(): void {
    this.getAgencies();
    this.loadAvailableAdvertisers();
  }

 
///get advertisers
getAdvertisers() {
  this._http.sendGetRequest<any>(Services.GET_ADVERTISERS, this._baseRequest).subscribe({
    next: (response) => {
      this.advertisers = response.data; 
      console.log("current advertisers", this.advertisers);
    },
    error: (err) => {
      console.error("Error fetching advertisers", err);
    }
  });
}
  getDocumentUrlByUsernameAndPurpose(username: string, purpose: string): string {
    if (!username || !purpose) return '';
    const encodedUsername = encodeURIComponent(username);
    const encodedPurpose = encodeURIComponent(purpose);
    // Live:
    // return `https://backend.qubic3d.co.za/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
    // Local:
    return `http://localhost:8181/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  imageLoadFailed: { [email: string]: boolean } = {};

  onImageError(email: string) {
    this.imageLoadFailed[email] = true;
  }

  getAgencies(): void {
    this.isLoading = true;
    // Live:
    // this.http.get<any>('https://backend.qubic3d.co.za/profile/get-users-by-role/agency')
    // Local:
    this.http.get<any>('http://localhost:8181/profile/get-users-by-role/agency')
      .subscribe({
        next: (response) => {
          this.agencies = response.data || [];
          this.filteredAgencies = [...this.agencies];
          this.isLoading = false;
          this.updateStats();
        },
        error: (error) => {
          console.error('Error fetching agencies:', error);
          this.isLoading = false;
        }
      });
  }

  private updateStats(): void {
    const all = this.agencies || [];
    this.totalAgencies = all.length;
    this.activeAgencies = all.filter(a => (a.status || '').toLowerCase() === 'active').length;
    this.inactiveAgencies = Math.max(0, this.totalAgencies - this.activeAgencies);
    this.totalRevenue = all.reduce((sum: number, a: any) => sum + (Number(a.revenue) || 0), 0);
  }

  loadAvailableAdvertisers(): void {
    this.advertiserService.getAllAdvertisers().subscribe({
      next: (response) => {
        this.availableAdvertisers = response.data || [];
      },
      error: (error) => {
        console.error('Error loading advertisers:', error);
      }
    });
  }

  toggleAgencyDetails(agencyId: number): void {
    this.expandedAgencies[agencyId] = !this.expandedAgencies[agencyId];
  }

  addAgency(): void {
    this.router.navigate(['/agencies/add']);
  }

  editAgency(userName: string): void {
    this.router.navigate(['/agencies/edit'], { queryParams: { username: userName } });
  }

  viewAgencyDetails(userName: string): void {
    this.router.navigate(['/agencies/details'], { queryParams: { username: userName } });
  }

  toggleFilter(filterId: string): void {
    this.filters = this.filters.map(filter => ({
      ...filter,
      active: filter.id === filterId
    }));
    this.activeFilter = filterId;

    if (filterId === 'all') {
      this.filteredAgencies = [...this.agencies];
    } else {
      this.filteredAgencies = this.agencies.filter(agency => {
        if (filterId === 'active' || filterId === 'inactive') {
          return agency.status?.toLowerCase() === filterId.toLowerCase();
        } else if (filterId === 'premium') {
          return agency.premium;
        }
        return true;
      });
    }
  }

  openAssignAdvertiserModal(agency: AgenciesResponse): void {
    this.selectedAgency = agency;
    this.selectedAdvertiserId = '';
    this.showAssignAdvertiserModal = true;
  }

  closeAssignAdvertiserModal(): void {
    this.showAssignAdvertiserModal = false;
    this.selectedAgency = null;
  }

  assignAdvertiser(): void {
    if (!this.selectedAgency || !this.selectedAdvertiserId) return;

    const advertiser = this.availableAdvertisers.find(a => a.id === this.selectedAdvertiserId);
    if (!advertiser) return;
  }
    // In a real app, you would call an API here to assign the advertiser to the agency
  //   if (!this.selectedAgency.advertisers) {
  //   //   this.selectedAgency.advertisers = [];
  //   // }
  //   // this.selectedAgency.advertisers.push(advertiser);

  //   // Update the agency in the list
  //   this.agencies = this.agencies.map(a => 
  //     a.id === this.selectedAgency?.id ? this.selectedAgency : a
  //   );
    
  //   this.closeAssignAdvertiserModal();
  // }
}