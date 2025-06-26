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
  ) {}

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers(): void {
    this.isLoading = true;
    this.loadError = false;
    this.http.get<any>('https://41.76.110.219:8443/profile/drivers').subscribe({
      next: (res) => {
        this.drivers = res.data || [];
        this.filteredDrivers = [...this.drivers];
        this.isLoading = false;
      },
      error: () => {
        this.loadError = true;
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

    this.http.post('https://41.76.110.219:8443/api/user/fleetowner/assign', payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error('Failed to assign driver:', err);
        this.isSubmitting = false;
      },
    });
  }
}
