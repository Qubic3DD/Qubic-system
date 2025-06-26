import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environmentApplication } from '../../../environments/environment';
import { VehicleInformationrmation } from '../../../model/adverrtiser.model';
import { DocumentPurpose } from '../../../services/document-purpose';
import { TransportType } from '../../../services/transport-type.enum';
import { VehicleType } from '../../../services/vehicle-type.enum';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-vehicle-dialog',
  templateUrl: './add-vehicle-dialog.component.html',
  styleUrls: ['./add-vehicle-dialog.component.css'],
  imports: [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatIconModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatDialogModule,
  ReactiveFormsModule,
  MatSnackBarModule,
  MatSpinner,
  CommonModule,
  

  // Custom Enums and Models (used in TypeScript, not part of Angular module system)
  // These are not part of the `imports` array, but are just regular TS imports:
  // VehicleInformation, DocumentPurpose, TransportType, VehicleType

  // Note: Also ensure BrowserAnimationsModule is imported in your main app module.
]

})
export class AddVehicleDialogComponent implements OnInit {
  vehicleForm: FormGroup;
  isEditing = false;
  isLoading = false;
  isUploading = false;
  uploadProgress = 0;
  vehicleImageFile: File | null = null;
  vehicleImagePreview: string | SafeUrl | null = null;
  transportTypes = Object.values(TransportType);
  vehicleTypes = Object.values(VehicleType);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddVehicleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      applicationId: number, 
      vehicle?: VehicleInformationrmation 
    },
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {
    this.vehicleForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      colour: ['', Validators.required],
      licenseRegistrationNo: ['', Validators.required],
      transportType: [TransportType.TAXI, Validators.required],
      vehicleType: [VehicleType.HATCH, Validators.required],
      vehicleImageUrl: ['']
    });

    if (data.vehicle) {
      this.isEditing = true;
      this.vehicleForm.patchValue(data.vehicle);
      if (data.vehicle.vehicleImageUrl) {
        this.vehicleImagePreview = data.vehicle.vehicleImageUrl;
      }
    }
  }

  ngOnInit(): void {
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.snackBar.open('Only JPEG and PNG images are allowed', 'Close', { duration: 3000 });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Image size should be less than 5MB', 'Close', { duration: 3000 });
        return;
      }

      this.vehicleImageFile = file;
      this.vehicleImagePreview = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
    }
  }

  removeImage(): void {
    this.vehicleImageFile = null;
    this.vehicleImagePreview = null;
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const vehicleData = this.vehicleForm.value;

    if (this.isEditing) {
      this.updateVehicle(vehicleData);
    } else {
      this.createVehicle(vehicleData);
    }
  }

  private createVehicle(vehicleData: Partial<VehicleInformationrmation>): void {
    // First create the vehicle record
    this.http.post(`${environmentApplication.api}applications/${this.data.applicationId}/vehicles`, vehicleData)
      .subscribe({
        next: (response: any) => {
          const vehicleId = response.id;
          if (this.vehicleImageFile && vehicleId) {
            this.uploadVehicleImage(vehicleId).then(() => {
              this.handleSuccess('Vehicle created successfully');
            }).catch(() => {
              this.handleSuccess('Vehicle created but image upload failed');
            });
          } else {
            this.handleSuccess('Vehicle created successfully');
          }
        },
        error: (err) => {
          this.handleError('Failed to create vehicle', err);
        }
      });
  }

  private updateVehicle(vehicleData: Partial<VehicleInformationrmation>): void {
    if (!this.data.vehicle?.id) return;

    this.http.put(`${environmentApplication.api}vehicles/${this.data.vehicle.id}`, vehicleData)
      .subscribe({
        next: () => {
          if (this.vehicleImageFile) {
            this.uploadVehicleImage(this.data.vehicle!.id!).then(() => {
              this.handleSuccess('Vehicle updated successfully');
            }).catch(() => {
              this.handleSuccess('Vehicle updated but image upload failed');
            });
          } else {
            this.handleSuccess('Vehicle updated successfully');
          }
        },
        error: (err) => {
          this.handleError('Failed to update vehicle', err);
        }
      });
  }

  private async uploadVehicleImage(vehicleId: number): Promise<void> {
    if (!this.vehicleImageFile) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.vehicleImageFile);
    formData.append('purpose', DocumentPurpose.VEHICLE_PHOTO.toString());

    try {
      await this.http.post(
        `${environmentApplication.api}vehicles/${vehicleId}/images/purpose/VEHICLE_PHOTO`,
        formData,
        { reportProgress: true, observe: 'events' }
      ).toPromise();
    } finally {
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  private handleSuccess(message: string): void {
    this.isLoading = false;
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.dialogRef.close('success');
  }

  private handleError(message: string, error: any): void {
    this.isLoading = false;
    console.error(error);
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTransportTypeName(type: TransportType): string {
    return type.split('_').map((word: string) => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  getVehicleTypeName(type: VehicleType): string {
    return type.split('_').map((word: string) => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }
}