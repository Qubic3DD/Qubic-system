// vehicles.component.ts
import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../pages/campaign/confirm-dialog/confirm-dialog.component';
import { VehicleService } from '../../services/vehicle.service';
import { CommonModule } from '@angular/common';
import { VehicleInformationrmation } from '../../model/adverrtiser.model';
@Component({
  selector: 'app-vehicles',
  standalone: true,
  templateUrl: './vehicles.component.component.html',
  styleUrls: ['./vehicles.component.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class VehiclesComponentFleet implements OnInit {
  vehicles: VehicleInformationrmation[] = [];
  isLoading = false;
  isSaving = false;
  isDeleting = false;
  error: string | null = null;
  searchEmail = '';
  isAddingVehicle = false;
  currentVehicle: VehicleInformationrmation | null = null;

  vehicleForm: FormGroup;

  vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Bus', 'Other'] as const;
  transportTypes = ['Personal', 'Commercial', 'Rental', 'Public', 'Other'] as const;

  constructor(
    private vehicleService: VehicleService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.vehicleForm = this.fb.group({
      capacity: ['', [Validators.required, Validators.min(1)]],
      colour: ['', Validators.required],
      licenseRegistrationNo: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      transportType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      make: [''],
      model: [''],
      year: [null, [Validators.min(1900), Validators.max(new Date().getFullYear())]],
      plateNumber: [''],
      public: [false]
    });
  }

  ngOnInit(): void {}

  fetchVehiclesByEmail(): void {
    if (!this.searchEmail.trim()) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.error = null;
    
    this.vehicleService.getVehiclesByUserEmail(this.searchEmail.trim()).subscribe({
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

  startEditVehicle(vehicle: VehicleInformationrmation): void {
    this.currentVehicle = vehicle;
    this.vehicleForm.patchValue(vehicle);
    this.isAddingVehicle = true;
  }

  cancelEdit(): void {
    this.isAddingVehicle = false;
    this.currentVehicle = null;
    this.vehicleForm.reset({ public: false });
  }

  submitVehicle(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const vehicleData = this.vehicleForm.value as VehicleInformationrmation;

    if (this.currentVehicle) {
      vehicleData.id = this.currentVehicle.id;
    }

    this.vehicleService.saveVehicle(vehicleData).subscribe({
      next: () => {
        this.showSuccess(`Vehicle ${this.currentVehicle ? 'updated' : 'added'} successfully!`);
        this.resetAfterSave();
      },
      error: (err) => {
        this.showError(err.message || 'Failed to save vehicle');
        this.isSaving = false;
      }
    });
  }

  private resetAfterSave(): void {
    this.isSaving = false;
    this.isAddingVehicle = false;
    this.currentVehicle = null;
    if (this.searchEmail) {
      this.fetchVehiclesByEmail();
    }
  }

  confirmDelete(vehicle: VehicleInformationrmation): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${vehicle.licenseRegistrationNo}?`,
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
    this.isDeleting = true;
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        this.showSuccess('Vehicle deleted successfully!');
        if (this.searchEmail) {
          this.fetchVehiclesByEmail();
        }
        this.isDeleting = false;
      },
      error: (err) => {
        this.showError(err.message || 'Failed to delete vehicle');
        this.isDeleting = false;
      }
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['bg-green-500', 'text-white', 'dark:bg-green-700']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['bg-red-500', 'text-white', 'dark:bg-red-700']
    });
  }

  trackByVehicleId(index: number, vehicle: VehicleInformationrmation): number {
    return vehicle.id!;
  }
}