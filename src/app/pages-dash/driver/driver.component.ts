import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DriverProfile } from '../../api/Response/interfaces';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponent implements OnInit {
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

  constructor(private http: HttpClient, public router: Router) {}

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDriversd(): Observable<DriverProfile[]> {
  return this.http.get<any>('http://192.168.8.100:8443/profile/drivers').pipe(
    map((response: { data: any; }) => response.data) // extract data here
  );
}

fetchDrivers(): void {
  this.isLoading = true;
  this.http.get<any>('http://192.168.8.100:8443/profile/drivers').subscribe({
    next: (response) => {
      this.drivers = response.data;
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
  this.router.navigate(['/drivers/details'], {
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
    return `http://192.168.8.100:8443/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
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
    // this.showAddDriverModal = true;
    this.router.navigate(['/drivers/add']);
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
      .post<any>('http://192.168.8.100:8443/profile/drivers', this.newDriver)
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
    this.router.navigate(['/drivers/edit', driver.email]);
  }


  deleteDriver(id: number): void {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.isLoading = true;
      this.http
        .delete(`http://192.168.8.100:8443/profile/drivers/${id}`)
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
  goToEditDriver(driverId: string) {
    this.router.navigate(['/drivers', driverId, 'edit']); // Adjust route as needed
  }
}
