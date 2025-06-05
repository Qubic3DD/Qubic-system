import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseRequest } from '../../api/Request/base-request';
import { RequestSenderService } from '../../core/request-sender.service';
import { FleetOwnersResponse } from '../../api/Response/FleetOwnersResponse';
import { Services } from '../../core/services';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-fleet-owners',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fleet-owners.component.html',
  styleUrls: ['./fleet-owners.component.css']
})
export class FleetOwnersComponent implements OnInit {
  _baseRequest: BaseRequest = new BaseRequest();
  fleetOwners: FleetOwnersResponse[] = [];
  filteredFleetOwners: FleetOwnersResponse[] = [];
  activeFilter: string = 'all';
  isLoading: boolean = false;

  filters: Filter[] = [
    { id: 'all', label: 'All', active: true },
    { id: 'active', label: 'Active', active: false },
    { id: 'inactive', label: 'Inactive', active: false },
    { id: 'verified', label: 'Verified', active: false }
  ];

  constructor(
    private router: Router,
    private _http: RequestSenderService,
    private http: HttpClient,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.getFleetOwners();
  }

  getFleetOwners(): void {
    this.isLoading = true;
    this.http.get<any>('http://41.76.110.219:8181/profile/get-users-by-role/fleet_owner')
      .subscribe({
        next: (response) => {
          this.fleetOwners = response.data || [];
          this.filteredFleetOwners = [...this.fleetOwners];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching fleet owners:', error);
          this.isLoading = false;
        }
      });
  }

  addFleetOwner(): void {
    this.router.navigate(['/fleet-owners/add']);
  }

  editFleetOwner(userName: string): void {
    this.router.navigate(['/fleet-owners/edit'], { queryParams: { username: userName } });
  }

  viewFleetOwnerDetails(userName: string): void {
    this.router.navigate(['/fleet-owners/details'], { queryParams: { username: userName } });
  }

  deleteFleetOwner(userName: string): void {
    this.confirmDialog.confirm('Confirm Delete', `Are you sure you want to delete ${userName}?`)
      .then((confirmed) => {
        if (confirmed) {
          this._http.sendGetRequest<any>(`${Services.DELETE_FLEET_OWNER}/${userName}`).subscribe({
            next: () => {
              console.log(`${userName} deleted`);
              this.fleetOwners = this.fleetOwners.filter(f => f.userName !== userName);
              this.filteredFleetOwners = this.filteredFleetOwners.filter(f => f.userName !== userName);
            },
            error: (err) => {
              console.error(`Failed to delete ${userName}`, err);
            }
          });
        }
      });
  }

  getDocumentUrlByUsernameAndPurpose(username: string, purpose: string): string {
    if (!username || !purpose) return '';
    const encodedUsername = encodeURIComponent(username);
    const encodedPurpose = encodeURIComponent(purpose);
    return `http://41.76.110.219:8181/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
  }

  toggleFilter(filterId: string): void {
    this.filters = this.filters.map(filter => ({
      ...filter,
      active: filter.id === filterId
    }));
    this.activeFilter = filterId;

    if (filterId === 'all') {
      this.filteredFleetOwners = [...this.fleetOwners];
    } else {
      this.filteredFleetOwners = this.fleetOwners.filter(owner =>
        owner.status?.toLowerCase() === filterId.toLowerCase()
      );
    }
  }
}

type Filter = {
  id: string;
  label: string;
  active: boolean;
};
