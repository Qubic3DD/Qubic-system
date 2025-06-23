import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../pages/campaign/confirm-dialog/confirm-dialog.component';
import { VehicleService } from '../../services/vehicle.service';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { VehicleInformationrmation } from '../../model/adverrtiser.model';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.component.html',
  styleUrls: ['./vehicles.component.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class VehiclesComponent implements OnInit {
  vehicles: VehicleInformationrmation[] = [];
  isLoading = false;
  error: string | null = null;
  searchEmail = '';
  isAddingVehicle = false;
  vehicleForm: FormGroup;
  currentVehicle: VehicleInformationrmation | null = null;

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
      capacity: ['', [Validators.required, Validators.maxLength(50)]],
      colour: ['', [Validators.required, Validators.maxLength(30)]],
      licenseRegistrationNo: ['', [Validators.required, Validators.maxLength(20)]],
      transportType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      make: ['', Validators.maxLength(50)],
      model: ['', Validators.maxLength(50)],
      year: [null, [Validators.min(1900), Validators.max(new Date().getFullYear())]],
      plateNumber: ['', Validators.maxLength(20)],
      public: [false]
    });
  }

  ngOnInit(): void {
    // Optionally load vehicles for current user on init
  }

  fetchVehiclesByEmail(): void {
    if (!this.searchEmail.trim()) {
      this.error = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.vehicleService.getVehiclesByUserEmail(this.searchEmail.trim())
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (vehicles) => {
          this.vehicles = vehicles;
        },
        error: (err) => {
          this.error = err.error?.message || err.message || 'Failed to fetch vehicles';
          this.showSnackbar(this.error!, 'error');
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
    this.vehicleForm.patchValue({
      ...vehicle,
      year: vehicle.year ? Number(vehicle.year) : null
    });
    this.isAddingVehicle = true;
  }

  cancelEdit(): void {
    this.isAddingVehicle = false;
    this.currentVehicle = null;
    this.vehicleForm.reset({ public: false });
  }

  submitVehicle(): void {
    if (this.vehicleForm.invalid) {
      this.markFormGroupTouched(this.vehicleForm);
      return;
    }

    const vehicleData = this.vehicleForm.value;
    const request = this.currentVehicle
      ? this.vehicleService.updateVehicle(this.currentVehicle.id!, { 
          ...this.currentVehicle, 
          ...vehicleData,
          year: vehicleData.year ? String(vehicleData.year) : null
        })
      : this.vehicleService.addVehicle({ 
          ...vehicleData, 
          userInformationId: null, 
          creationDate: new Date().toISOString(),
          year: vehicleData.year ? String(vehicleData.year) : null
        });

    this.isLoading = true;
    request
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.showSnackbar(`Vehicle ${this.currentVehicle ? 'updated' : 'added'} successfully!`, 'success');
          if (this.searchEmail) {
            this.fetchVehiclesByEmail();
          }
          this.isAddingVehicle = false;
          this.currentVehicle = null;
        },
        error: (err: { error: { message: any; }; message: any; }) => {
          const errorMsg = err.error?.message || err.message || 'Failed to save vehicle';
          this.showSnackbar(errorMsg, 'error');
        }
      });
  }

  confirmDelete(vehicle: VehicleInformationrmation): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete vehicle ${vehicle.licenseRegistrationNo}?`,
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
    this.isLoading = true;
    this.vehicleService.deleteVehicle(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.showSnackbar('Vehicle deleted successfully!', 'success');
          if (this.searchEmail) {
            this.fetchVehiclesByEmail();
          }
        },
        error: (err) => {
          const errorMsg = err.error?.message || err.message || 'Failed to delete vehicle';
          this.showSnackbar(errorMsg, 'error');
        }
      });
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' 
        ? ['bg-green-500', 'text-white', 'dark:bg-green-700'] 
        : ['bg-red-500', 'text-white', 'dark:bg-red-700']
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  trackByVehicleId(index: number, vehicle: VehicleInformationrmation): number {
    return vehicle.id!;
  }

  get formControls() {
    return this.vehicleForm.controls;
  }
}