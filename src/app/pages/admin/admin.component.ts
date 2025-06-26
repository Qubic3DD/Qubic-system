import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BaseRequest } from '../../api/Request/base-request';
import { RequestSenderService } from '../../core/request-sender.service';
import { Services } from '../../core/services';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { AdminResponse } from '../../api/Response/AdminResponse';

type Filter = {
  id: string;
  label: string;
  active: boolean;
};

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  _baseRequest: BaseRequest = new BaseRequest();
  admins: AdminResponse[] = [];
  filteredAdmins: AdminResponse[] = [];
  activeFilter: string = 'all';
  isLoading: boolean = false;

  filters: Filter[] = [
    { id: 'all', label: 'All', active: true },
    { id: 'active', label: 'Active', active: false },
    { id: 'inactive', label: 'Inactive', active: false },
    { id: 'verified', label: 'Verified', active: false },
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    private _http: RequestSenderService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.getAdmins();
  }

  getAdmins(): void {
    this.isLoading = true;
    this.http
      .get<any>('https://41.76.110.219:8443/profile/get-users-by-role/admin')
      .subscribe({
        next: (response) => {
          this.admins = response.data || [];
          this.filteredAdmins = [...this.admins];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching admins:', error);
          this.isLoading = false;
        },
      });
  }
  addAdmin(): void {
    // this.showAddDriverModal = true;
    this.router.navigate(['/admins/add']);
  }


  editAdmin(userName: string): void {
    this.router.navigate(['/admins/edit'], {
      queryParams: { username: userName },
    });
  }

  viewAdminDetails(userName: string): void {
    this.router.navigate(['/admins/details'], {
      queryParams: { username: userName },
    });
  }

  deleteAdmin(userName: string): void {
    this.confirmDialog
      .confirm('Confirm Delete', `Are you sure you want to delete ${userName}?`)
      .then((confirmed) => {
        if (confirmed) {
          this._http
            .sendGetRequest<any>(`${Services.DELETE_ADMIN}/${userName}`)
            .subscribe({
              next: () => {
                console.log(`${userName} deleted`);
                this.admins = this.admins.filter(
                  (admin) => admin.userName !== userName
                );
                this.filteredAdmins = this.filteredAdmins.filter(
                  (admin) => admin.userName !== userName
                );
              },
              error: (err: any) => {
                console.error(`Failed to delete ${userName}`, err);
              },
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
  toggleFilter(filterId: string): void {
    this.filters = this.filters.map((filter) => ({
      ...filter,
      active: filter.id === filterId,
    }));
    this.activeFilter = filterId;

    if (filterId === 'all') {
      this.filteredAdmins = [...this.admins];
    } else {
      this.filteredAdmins = this.admins.filter(
        (admin) => admin.status?.toLowerCase() === filterId.toLowerCase()
      );
    }
  }
}
