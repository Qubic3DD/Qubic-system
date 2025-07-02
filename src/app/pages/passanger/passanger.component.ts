import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseRequest } from '../../api/Request/base-request';
import { RequestSenderService } from '../../core/request-sender.service';
import { Services } from '../../core/services';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { PassangerResponse } from '../../api/Response/PassangerResponse';

type Filter = {
  id: string;
  label: string;
  active: boolean;
};

@Component({
  selector: 'app-passanger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passanger.component.html',
  styleUrls: ['./passanger.component.css']
})
export class PassengerComponent implements OnInit {
  _baseRequest: BaseRequest = new BaseRequest();
  passengers: PassangerResponse[] = [];
  filteredPassengers: PassangerResponse[] = [];
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
    private http: HttpClient,
    private _http: RequestSenderService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.getPassengers();
  }

  getPassengers(): void {
    this.isLoading = true;
    this.http.get<any>('https://backend.qubic3d.co.za/profile/get-users-by-role/passenger')
      .subscribe({
        next: (response) => {
          this.passengers = response.data || [];
          this.filteredPassengers = [...this.passengers];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching passengers:', error);
          this.isLoading = false;
        }
      });
  }
  addPassanger(): void {
    // this.showAddDriverModal = true;
    this.router.navigate(['/passenger/add']);
  }


  editPassanger(userName: string): void {
    this.router.navigate(['/passenger/edit'], {
      queryParams: { username: userName },
    });
  }

  viewPassangerDetails(userName: string): void {
    this.router.navigate(['/passenger/details'], {
      queryParams: { username: userName },
    });
  }


  deletePassenger(userName: string): void {
    this.confirmDialog.confirm('Confirm Delete', `Are you sure you want to delete ${userName}?`)
      .then((confirmed) => {
        if (confirmed) {
          this._http.sendGetRequest<any>(`${Services.DELETE_PASSENGER}/${userName}`).subscribe({
            next: () => {
              console.log(`${userName} deleted`);
              this.passengers = this.passengers.filter(p => p.userName !== userName);
              this.filteredPassengers = this.filteredPassengers.filter(p => p.userName !== userName);
            },
            error: (err: any) => {
              console.error(`Failed to delete ${userName}`, err);
            }
          });
        }
      });
  }

  
  getDocumentUrlByUsernameAndPurpose(
    username: string,
    purpose: string
  ): string {
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

  toggleFilter(filterId: string): void {
    this.filters = this.filters.map(filter => ({
      ...filter,
      active: filter.id === filterId
    }));
    this.activeFilter = filterId;

    if (filterId === 'all') {
      this.filteredPassengers = [...this.passengers];
    } else {
      this.filteredPassengers = this.passengers.filter(p =>
        p.status?.toLowerCase() === filterId.toLowerCase()
      );
    }
  }
}
