import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DriverProfile } from '../../../api/Response/interfaces'; // update import path
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-driver-dialog',
  templateUrl: './add-driver-dialog.component.html',
  styleUrls: ['./add-driver-dialog.component.css'],
    imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    CommonModule
  ]
})
export class AddDriverDialogComponent implements OnInit {
  
  userEmail: string | null = null;
  userName: string | null = null;
  userId: number | null = null;
  selectedDriverEmail = new FormControl('');
  drivers: DriverProfile[] = [];
  filteredDrivers: DriverProfile[] = [];
  searchQuery = '';
  isLoading = false;
  isSubmitting = false;
  loadError = false;

  constructor(
    public dialogRef: MatDialogRef<AddDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { fleetOwnerEmail: string },
    private http: HttpClient
  ) {  this.userEmail = localStorage.getItem('userEmail');
    this.userId = Number(localStorage.getItem('userId'));
    this.userName = localStorage.getItem('userName');}

  ngOnInit(): void {
    this.fetchDrivers();
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

  filterDrivers(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredDrivers = this.drivers.filter((driver) =>
      driver.fullName.toLowerCase().includes(query) ||
      driver.email.toLowerCase().includes(query)
    );
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredDrivers = [...this.drivers];
  }

  assignDriver(): void {
    if (!this.selectedDriverEmail.value) return;

    const payload = {
      userEmail: this.selectedDriverEmail.value,
      fleetOwnerEmail: this.data.fleetOwnerEmail,
    };

    this.isSubmitting = true;

    this.http.post('http://41.76.110.219:8443/api/user/fleetowner/assign', payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Failed to assign driver:', err);
        this.isSubmitting = false;
      },
    });
  }
}
