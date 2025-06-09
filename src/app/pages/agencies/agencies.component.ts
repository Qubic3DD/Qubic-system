import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseRequest } from '../../api/Request/base-request';
import { RequestSenderService } from '../../core/request-sender.service';
import { AgenciesResponse } from '../../api/Response/AgenciesResponse';
import { Services } from '../../core/services';

type Filter = {
  id: string;
  label: string;
  active: boolean;
};

@Component({
  selector: 'app-agencies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.css']
})
export class AgenciesComponent implements OnInit {
  _baseRequest: BaseRequest = new BaseRequest();
  agencies: AgenciesResponse[] = [];
  filteredAgencies: AgenciesResponse[] = [];
  activeFilter: string = 'all';
  isLoading: boolean = false;

  filters: Filter[] = [
    { id: 'all', label: 'All', active: true },
    { id: 'active', label: 'Active', active: false },
    { id: 'inactive', label: 'Inactive', active: false },
    { id: 'premium', label: 'Premium', active: false }
  ];

  constructor(
    private router: Router,
    private _http: RequestSenderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getAgencies();
  }

  getAgencies(): void {
    this.isLoading = true;
    this.http.get<any>('http://196.168.8.29:8443/profile/get-users-by-role/agency')
      .subscribe({
        next: (response) => {
          this.agencies = response.data || [];
          this.filteredAgencies = [...this.agencies];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching agencies:', error);
          this.isLoading = false;
        }
      });
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
      this.filteredAgencies = this.agencies.filter(agency =>
        agency.status?.toLowerCase() === filterId.toLowerCase()
      );
    }
  }
}
