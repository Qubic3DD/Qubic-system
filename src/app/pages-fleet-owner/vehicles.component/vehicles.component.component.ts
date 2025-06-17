// vehicles.component.ts
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { VehicleInfo2, VehicleInfo } from '../../api/Response/interfaces';
import { ConfirmDialogComponent } from '../../pages/campaign/confirm-dialog/confirm-dialog.component';
import { VehicleService } from '../../services/vehicle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.component.html',
  styleUrls: ['./vehicles.component.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Add ReactiveFormsModule here
})
export class VehiclesComponentFleet implements OnInit {
  vehicles: VehicleInfo2[] = [];
  isLoading = false;
  error: string | null = null;
  searchEmail = '';
  isAddingVehicle = false;
  vehicleForm: FormGroup;
  currentVehicle: VehicleInfo2 | null = null;

  // Vehicle types for dropdown
  vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Bus', 'Other'];
  transportTypes = ['Personal', 'Commercial', 'Rental', 'Public', 'Other'];

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.vehicleForm = this.fb.group({
      capacity: ['', Validators.required],
      colour: ['', Validators.required],
      licenseRegistrationNo: ['', Validators.required],
      transportType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      make: [''],
      model: [''],
      year: [null],
      plateNumber: [''],
      public: [false]
    });
  }

  ngOnInit(): void {
    // Optionally load vehicles for current user on init
  }

  fetchVehiclesByEmail(): void {
    if (!this.searchEmail) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.vehicleService.getVehiclesByUserEmail(this.searchEmail).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to fetch vehicles';
        this.isLoading = false;
      }
    });
  }

  startAddVehicle(): void {
    this.currentVehicle = null;
    this.vehicleForm.reset({ public: false });
    this.isAddingVehicle = true;
  }

  startEditVehicle(vehicle: VehicleInfo2): void {
    this.currentVehicle = vehicle;
    this.vehicleForm.patchValue(vehicle);
    this.isAddingVehicle = true;
  }

  cancelEdit(): void {
    this.isAddingVehicle = false;
    this.currentVehicle = null;
    this.vehicleForm.reset();
  }

  submitVehicle(): void {
    if (this.vehicleForm.invalid) {
      return;
    }

    const vehicleData = this.vehicleForm.value;
    const request = this.currentVehicle
      ? this.vehicleService.updateVehicle(this.currentVehicle.id!, { ...this.currentVehicle, ...vehicleData })
      : this.vehicleService.addVehicle({ ...vehicleData, userInformationId: null, creationDate: new Date().toISOString() });

    request.subscribe({
      next: (vehicle) => {
        this.snackBar.open(`Vehicle ${this.currentVehicle ? 'updated' : 'added'} successfully!`, 'Close', {
          duration: 3000,
          panelClass: ['bg-green-500', 'text-white', 'dark:bg-green-700']
        });
        if (this.searchEmail) {
          this.fetchVehiclesByEmail();
        }
        this.isAddingVehicle = false;
        this.currentVehicle = null;
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to save vehicle', 'Close', {
          duration: 3000,
          panelClass: ['bg-red-500', 'text-white', 'dark:bg-red-700']
        });
      }
    });
  }

  confirmDelete(vehicle: VehicleInfo2): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete this vehicle (${vehicle.licenseRegistrationNo})?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteVehicle(vehicle.id!);
      }
    });
  }

  deleteVehicle(id: number): void {
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        this.snackBar.open('Vehicle deleted successfully!', 'Close', {
          duration: 3000,
          panelClass: ['bg-green-500', 'text-white', 'dark:bg-green-700']
        });
        if (this.searchEmail) {
          this.fetchVehiclesByEmail();
        }
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Failed to delete vehicle', 'Close', {
          duration: 3000,
          panelClass: ['bg-red-500', 'text-white', 'dark:bg-red-700']
        });
      }
    });
  }

  trackByVehicleId(index: number, vehicle: VehicleInfo2): number {
    return vehicle.id!;
  }
}