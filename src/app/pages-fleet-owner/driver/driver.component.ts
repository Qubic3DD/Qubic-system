import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DriverProfile } from '../../api/Response/interfaces';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponentFleet implements OnInit {
  @Input() isCollapsed = false;

  userEmail: string | null = null;
  userName: string | null = null;
  userId: number | null = null;

  drivers: any[] = [];
  filteredDrivers: any[] = [];
  searchQuery = '';
  showAddDriverModal = false;
  isLoading = false;

  filters = [
    { id: 'all', label: 'All Drivers', active: true },
    { id: 'active', label: 'Active', active: false },
    { id: 'inactive', label: 'Inactive', active: false },
  ];

  newDriver: any = {
    email: '',
    phoneNo: '',
    firstName: '',
    lastName: '',
    licenseType: '',
    roles: ['DRIVER'],
    status: 'Active',
  };
  constructor(private http: HttpClient, public router: Router) {
    this.userEmail = localStorage.getItem('userEmail');
    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('userName');
  }

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDriversd(): Observable<DriverProfile[]> {
    return this.http.get<{ data: DriverProfile[] }>(
      `${environment.api}profile/fleet-owners/${this.userId}/drivers`
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching drivers:', error);
        return throwError(() => new Error('Failed to fetch drivers'));
      })
    );
  }

  fetchDrivers(): void {
    if (!this.userId) {
      console.error('User ID is not available');
      return;
    }

    this.isLoading = true;
    this.http.get<{ data: DriverProfile[] }>(
      `${environment.api}profile/fleet-owners/${this.userId}/drivers`
    ).subscribe({
      next: (response) => {
        this.drivers = response.data || [];
        this.filteredDrivers = [...this.drivers];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching drivers:', error);
        this.isLoading = false;
      },
    });
  }

  viewDriverDetails(userName: string): void {
    this.router.navigate(['/fleet-owner-dashboard/driver-details'], {
      queryParams: { username: userName },
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

  filterDrivers(): void {
    if (!this.searchQuery) {
      this.filteredDrivers = [...this.drivers];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredDrivers = this.drivers.filter(
      (driver) =>
        driver.firstName?.toLowerCase().includes(query) ||
        driver.lastName?.toLowerCase().includes(query) ||
        driver.email?.toLowerCase().includes(query) ||
        driver.phoneNo?.includes(query)
    );
  }

  toggleFilter(filterId: string): void {
    this.filters.forEach((filter) => {
      filter.active = filter.id === filterId;
    });

    if (filterId === 'all') {
      this.filteredDrivers = [...this.drivers];
    } else {
      this.filteredDrivers = this.drivers.filter(
        (driver) => driver.status?.toLowerCase() === filterId.toLowerCase()
      );
    }
  }

openAddDriverModal(): void {
  this.router.navigate(['/fleet-owner-dashboard/add'], {
    queryParams: { username: this.userName } // Make sure this.userName contains the fleet owner's email
  });
}

  closeAddDriverModal(): void {
    this.showAddDriverModal = false;
    this.newDriver = {
      userHandle: '',
      userName: '',
      email: '',
      phoneNo: '',
      firstName: '',
      lastName: '',
      licenseType: '',
      roles: ['DRIVER'],
      status: 'Active',
    };
  }

  addDriver(): void {
    this.isLoading = true;
    this.http
      .post<any>('https://backend.qubic3d.co.za/profile/drivers', this.newDriver)
      .subscribe({
        next: () => {
          this.fetchDrivers();
          this.closeAddDriverModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding driver:', error);
          this.isLoading = false;
        },
      });
  }

  editDriver(driver: any) {
    this.router.navigate(['/fleet-owner-dashboard/edit', driver.email]);
  }


  deleteDriver(id: number): void {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.isLoading = true;
      this.http
        .delete(`https://backend.qubic3d.co.za/profile/drivers/${id}`)
        .subscribe({
          next: () => {
            this.fetchDrivers();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error deleting driver:', error);
            this.isLoading = false;
          },
        });
    }
  }
goToEditDriver(email: string) {
  this.router.navigate(['/fleet-owner-dashboard/edit', email]);
}
}
