import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicationDto, UploadedDocuments } from '../../model/application.dto';
import { DocumentPurpose } from '../../services/document-purpose';
import { ApplicationsService } from '../../services/application.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppDocumentViewerComponent } from '../app-document-viewer/app-document-viewer.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Role } from '../../services/role.enum';
import { ROLE_CONFIGS } from '../../services/role.enum';
import { TransportType } from '../../services/transport-type.enum';
import { VehicleType } from '../../services/vehicle-type.enum';
import { environmentApplication } from '../../environments/environment';
import { FileType } from '../../services/file-type';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FileSizePipe } from "../../pagess-advertiser/campaign/campaign/add-campaign/file-size.pipe";
import { VehicleImageResponse, VehicleService } from '../../services/vehicle.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { VehicleInformationrmation } from '../../model/adverrtiser.model';
import { catchError, map, Observable, of, shareReplay, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-track-application',
  templateUrl: './application-tracking-component.component.html',
  styleUrls: ['./application-tracking-component.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FileSizePipe
  ],
  providers: [DatePipe],
})
export class TrackApplicationComponent implements OnInit {
formatRole(role: Role): string {
  switch (role) {
    case Role.DRIVER:
      return 'Driver';
    case Role.FLEET_OWNER:
      return 'Fleet Owner';
    case Role.AGENCY:
      return 'Agency';
    case Role.ADVERTISER:
      return 'Advertiser';
    default:
      return 'Unknown Role';
  }
}

getImagePreview(arg0: any) {
throw new Error('Method not implemented.');
}
  application: ApplicationDto | null = null;
  loading = true;
  error: string | null = null;
  activeTab: 'details' | 'documents' | 'missing' | 'vehicle' = 'details';

  // Vehicle properties
  showVehicleForm = false;
  newVehicle: Partial<VehicleInformationrmation> = {
    transportType: TransportType.TAXI,
    vehicleType: VehicleType.HATCH
  };
  vehicleImageFile: File | null = null;
  vehicleImagePreview: string | null = null;
  isEditingVehicle = false;
  private apiUrl = environmentApplication.api + 'images/';
  private imageCache = new Map<number, Observable<string | null>>();
  // Other existing properties...
  uploadProgress: number | null = null;
  isUploading = false;
  selectedDocumentPurpose: DocumentPurpose | null = null;
  selectedFile: File | null = null;
  vehicleTypes = Object.values(VehicleType).filter(value => typeof value === 'string') as string[];
  transportTypes = Object.values(TransportType).filter(value => typeof value === 'string') as string[];
  missingDocuments: DocumentPurpose[] = [];
Role: any;
vehicle: any;
i: any;

  constructor(
    private route: ActivatedRoute,
    private applicationsService: ApplicationsService,
    private vehicleService: VehicleService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private http: HttpClient,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const email = params.get('email');
      if (email) {
        this.fetchApplication(email);
      } else {
        this.error = 'No email provided in URL';
        this.loading = false;
      }
    });
  }submitVehicle(): void {
  if (!this.application?.id) return;

  // First, prepare the vehicle data (without image)
  const vehicleData = {
    ...this.newVehicle,
    applicationId: this.application.id,
    applicationNumber:this.application.id
  };

  // Remove image-related fields before sending
  delete vehicleData.vehicleImageUrl;

  // Determine if we're creating or updating
  const isCreate = !this.isEditingVehicle || !this.newVehicle.id;

  // Step 1: Create/Update the vehicle record
  const vehicleRequest = isCreate
    ? this.vehicleService.addVehicleToApplication(this.application.id, vehicleData)
    : this.vehicleService.updateVehicle(vehicleData);

  vehicleRequest.pipe(
    // If creating, ensure we have the ID before proceeding
    switchMap((response: any) => {
      // Handle case where backend might return the ID directly or in a nested property
      const vehicleId = response.id ;
      
      if (isCreate && !vehicleId) {
        throw new Error('Vehicle created but no ID returned');
      }

      // For create operations, update the local vehicle reference with the ID
      if (isCreate) {
        this.newVehicle.id = vehicleId;
      }

      // If we have an image file, upload it
      if (this.vehicleImageFile) {
        return this.uploadVehicleImage(vehicleId).pipe(
          catchError(imgError => {
            console.error('Error uploading vehicle image:', imgError);
            this.snackBar.open('Vehicle saved but image upload failed', 'Close', { duration: 5000 });
            // Even if image upload fails, we consider the operation successful
            return of(response);
          })
        );
      }
      return of(response);
    })
  ).subscribe({
    next: () => {
      this.handleVehicleSuccess();
    },
    error: (err: any) => {
      console.error(`Error ${isCreate ? 'adding' : 'updating'} vehicle:`, err);
      const errorMsg = err.message || `Failed to ${isCreate ? 'add' : 'update'} vehicle`;
      this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      this.resetUploadState();
    }
  });
}

private uploadVehicleImage(vehicleId: number): Observable<any> {
  if (!this.vehicleImageFile) return throwError(() => new Error('No image file selected'));

  const formData = new FormData();
  formData.append('file', this.vehicleImageFile);
  formData.append('purpose', DocumentPurpose.VEHICLE_PHOTO.toString());

  return this.http.post(
    `${environmentApplication.api}vehicles/${vehicleId}/images/purpose/VEHICLE_PHOTO`,
    formData,
    { reportProgress: true }
  );
}

private handleVehicleSuccess(): void {
  this.snackBar.open(`Vehicle ${this.isEditingVehicle ? 'updated' : 'added'} successfully!`, 'Close', { duration: 5000 });
  this.fetchApplication(this.application!.email);
  this.showVehicleForm = false;
  this.resetVehicleForm();
}
  // Vehicle methods
  addVehicle(): void {
    this.showVehicleForm = true;
    this.isEditingVehicle = false;
    this.resetVehicleForm();
  }

  editVehicle(vehicle: VehicleInformationrmation): void {
    this.showVehicleForm = true;
    this.isEditingVehicle = true;
    this.newVehicle = { ...vehicle };
    if (vehicle.vehicleImageUrl) {
      this.vehicleImagePreview = vehicle.vehicleImageUrl;
    }
  }

  cancelAddVehicle(): void {
    this.showVehicleForm = false;
    this.resetVehicleForm();
  }

  resetVehicleForm(): void {
    this.newVehicle = {
      transportType: TransportType.TAXI,
      vehicleType: VehicleType.HATCH
    };
    this.vehicleImageFile = null;
    this.vehicleImagePreview = null;
  }

  onVehicleImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.vehicleImageFile = input.files[0];
      this.vehicleImagePreview = URL.createObjectURL(this.vehicleImageFile);
    }
  }

  deleteVehicle(vehicleId: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleId).subscribe({
        next: () => {
          this.snackBar.open('Vehicle deleted successfully', 'Close', { duration: 3000 });
          if (this.application?.email) {
            this.fetchApplication(this.application.email);
          }
        },
        error: (err) => {
          this.snackBar.open('Error deleting vehicle', 'Close', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

private readonly validFileTypes: { [key in DocumentPurpose]: string[] } = {
  // Personal Documents
  [DocumentPurpose.PROFILE_PICTURE]: ['image/jpeg', 'image/png', 'image/gif'],
  [DocumentPurpose.ID_DOCUMENT]: ['application/pdf', 'image/jpeg', 'image/png'],
  [DocumentPurpose.PROOF_OF_ADDRESS]: ['application/pdf', 'image/jpeg', 'image/png'],
  [DocumentPurpose.LICENSE]: ['application/pdf', 'image/jpeg', 'image/png'],

  // Vehicle-related Documents
  [DocumentPurpose.VEHICLE_REGISTRATION]: ['application/pdf', 'image/jpeg', 'image/png'],
  [DocumentPurpose.VEHICLE_INSURANCE]: ['application/pdf'],
  [DocumentPurpose.VEHICLE_INSPECTION_REPORT]: ['application/pdf', 'image/jpeg', 'image/png'],
  [DocumentPurpose.VEHICLE_PHOTO]: ['image/jpeg', 'image/png'],
  [DocumentPurpose.ROADWORTHY_CERTIFICATE]: ['application/pdf', 'image/jpeg', 'image/png'],

  // Business-related Documents
  [DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE]: ['application/pdf', 'image/jpeg', 'image/png'],
  [DocumentPurpose.BUSINESS_LICENSE]: ['application/pdf', 'image/jpeg', 'image/png'],
  [DocumentPurpose.TAX_CLEARANCE_CERTIFICATE]: ['application/pdf'],
  [DocumentPurpose.COMPANY_PROFILE]: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  [DocumentPurpose.COMPANY_LOGO]: ['image/jpeg', 'image/png', 'image/svg+xml'],
  [DocumentPurpose.BUSINESS_ADDRESS_PROOF]: ['application/pdf', 'image/jpeg', 'image/png'],

  // Campaign-related Media
  [DocumentPurpose.CAMPAIGN_VIDEO]: ['video/mp4', 'video/quicktime'],
  [DocumentPurpose.CAMPAIGN_PICTURE]: ['image/jpeg', 'image/png', 'image/gif'],

  // Miscellaneous
  [DocumentPurpose.OTHER]: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};
private getFileTypeFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'pdf':
      return 'application/pdf';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream'; // Unknown type
  }
}

  // Other existing methods...
fetchApplication(email: string): void {
  this.loading = true;
  this.error = null;
  
  this.applicationsService.getApplicationByEmail(email).pipe(
    switchMap((applications) => {
      if (!applications || applications.length === 0) {
        throw new Error('No application found');
      }
      
      this.application = applications[0];
      
      // Fetch vehicles for this application
      if (this.application.id) {
        return this.vehicleService.getVehiclesByApplication(this.application.id).pipe(
          map((vehicles) => {
            // Add vehicles to the application object
            this.application!.VehicleInformationrmation = vehicles;
          
            return applications;
          }),
          catchError((vehicleError) => {
            console.error('Error fetching vehicles:', vehicleError);
            // Continue even if vehicle fetch fails
            return of(applications);
          })
        );

        
      }
      return of(applications);
    })
  ).subscribe({
    next: () => {
      this.fetchMissingDocuments();
      this.loading = false;
    },
    error: (err) => {
      this.error = 'Failed to load application. Please try again later.';
      this.loading = false;
      console.error(err);
    }
  });
}

calculateAge(birthDate: string | Date | null | undefined): number {
  if (!birthDate) return 0;

  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return 0; // Invalid date fallback

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}



fetchMissingDocuments(): void {
  if (!this.application?.id) {
    this.calculateMissingDocuments(); // Fallback to client-side calculation
    return;
  }

  this.applicationsService.getMissingDocuments(this.application.id).subscribe({
    next: (missingDocs) => {
      this.missingDocuments = missingDocs;
      
      // If no missing documents from API, try client-side calculation
      if (missingDocs.length === 0) {
        this.calculateMissingDocuments();
      }
    },
    error: () => {
      console.error('Failed to fetch missing documents');
      this.calculateMissingDocuments();
    }
  });
}
  calculateMissingDocuments(): void {
    if (!this.application || !this.application.applicationRole) {
      this.missingDocuments = [];
      return;
    }

    const requiredDocs = this.getRequiredDocumentsForRole(this.application.applicationRole);
    const uploadedDocs = this.application.uploadedDocuments?.map(d => d.documentPurpose) || [];
    
    this.missingDocuments = requiredDocs.filter(docType => !uploadedDocs.includes(docType));
  }

  onFileSelected(event: Event, purpose: DocumentPurpose): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.selectedDocumentPurpose = purpose;
      
      if (this.selectedFile.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size should be less than 5MB', 'Close', { duration: 5000 });
        this.selectedFile = null;
        input.value = '';
        return;
      }
      
      if (!this.isValidFileType(this.selectedFile, purpose)) {
        this.snackBar.open('Invalid file type for this document', 'Close', { duration: 5000 });
        this.selectedFile = null;
        input.value = '';
        return;
      }
    }
  }

getVehicleImageUrl(vehicleId: number): Observable<string | null> { 
    if (this.imageCache.has(vehicleId)) {
        return this.imageCache.get(vehicleId)!;
    }

    const imageUrl$ = this.vehicleService.getVehicleImages(vehicleId).pipe(
        map(images => {
            if (!images || images.length === 0) return null;
            
            // Assuming the first image is the main vehicle image
            const image = images[0];
            
            // Construct the URL based on your API structure
            return `${environmentApplication.api}vehicles/images/${image.id}`;
        }),
        catchError(error => {
            console.error(`Failed to get image for vehicle ${vehicleId}`, error);
            return of(null);
        }),
        shareReplay(1) // Cache the result
    );

    this.imageCache.set(vehicleId, imageUrl$);
    return imageUrl$;
}


isValidFileType(file: File, purpose: DocumentPurpose): boolean {
  const allowedTypes = this.validFileTypes[purpose];
  if (!allowedTypes) {
    console.error(`No file types defined for document purpose: ${purpose}`);
    return false;
  }
  
  // Special case for Windows file types that might report differently
  const fileType = file.type === '' && file.name ? 
    this.getFileTypeFromExtension(file.name) : 
    file.type;

  return allowedTypes.includes(fileType);
}
  uploadDocument(): void {
    if (!this.selectedFile || !this.selectedDocumentPurpose || !this.application?.id) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('documentPurpose', this.selectedDocumentPurpose);
    formData.append('fileType', this.getFileType(this.selectedFile));

    this.http.post(`${environmentApplication.api}applications/${this.application.id}/documents/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.handleUploadSuccess();
        }
      },
      error: (error) => {
        this.handleUploadError(error);
      }
    });
  }

  private handleUploadSuccess(): void {
    this.snackBar.open('Document uploaded successfully!', 'Close', { duration: 5000 });
    this.resetUploadState();
    
    if (this.application?.email) {
      this.fetchApplication(this.application.email);
    }
    
    if (this.activeTab === 'missing' && this.missingDocuments.length === 0) {
      this.activeTab = 'documents';
    }
  }

  private handleUploadError(error: any): void {
    console.error('Error uploading document:', error);
    this.snackBar.open('Failed to upload document. Please try again.', 'Close', { duration: 5000 });
    this.resetUploadState();
  }

  private resetUploadState(): void {
    this.isUploading = false;
    this.uploadProgress = null;
    this.selectedFile = null;
    this.selectedDocumentPurpose = null;
  }

  deleteDocument(purpose: DocumentPurpose): void {
    if (!this.application?.id) return;

    if (confirm('Are you sure you want to delete this document?')) {
      this.applicationsService.deleteDocument(this.application.id, purpose).subscribe({
        next: () => {
          this.snackBar.open('Document deleted successfully!', 'Close', { duration: 5000 });
          this.fetchApplication(this.application!.email);
        },
        error: (err) => {
          console.error('Error deleting document:', err);
          this.snackBar.open('Failed to delete document', 'Close', { duration: 5000 });
        }
      });
    }
  }

  viewDocument(document: UploadedDocuments): void {
    if (!this.application?.id) return;

    this.applicationsService.viewDocument(this.application.id, document.documentPurpose)
      .subscribe({
        next: (blob) => {
          const fileURL = URL.createObjectURL(blob);
          const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
          
          this.dialog.open(AppDocumentViewerComponent, {
            width: '90vw',
            maxWidth: '1200px',
            height: '90vh',
            data: {
              title: document.name,
              url: safeUrl,
              fileType: document.fileType
            },
            panelClass: 'document-viewer-dialog'
          });
        },
        error: (err) => {
          console.error('Error viewing document:', err);
          this.snackBar.open('Failed to view document. Please try again.', 'Close', { duration: 5000 });
        }
      });
  }

  onDeleteVehicle(vehicleId: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(vehicleId).subscribe({
        next: () => {
          // Handle successful deletion
          this.snackBar.open('Vehicle deleted successfully', 'Close', { duration: 3000 });
          this.refreshVehicles(); // Refresh your vehicle list
        },
        error: (err) => {
          this.snackBar.open('Error deleting vehicle', 'Close', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }

  onUpdateVehicle(vehicle: VehicleInformationrmation): void {
    this.vehicleService.updateVehicle( vehicle).subscribe({
      next: (updatedVehicle) => {
        // Handle successful update
        this.snackBar.open('Vehicle updated successfully', 'Close', { duration: 3000 });
        this.refreshVehicles(); // Refresh your vehicle list
      },
      error: (err) => {
        this.snackBar.open('Error updating vehicle', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }
  private refreshVehicles(): void {
    // Implement your refresh logic here
  }
  downloadDocument(document: UploadedDocuments): void {
    if (!this.application?.id) return;

    this.applicationsService.downloadDocument(this.application.id, document.documentPurpose)
      .subscribe({
        next: (blob) => {
          saveAs(blob, document.name || `${document.documentPurpose}_${new Date().getTime()}`);
        },
        error: (err) => {
          console.error('Error downloading document:', err);
          this.snackBar.open('Failed to download document. Please try again.', 'Close', { duration: 5000 });
        }
      });
  }


  // Helper methods
  getRequiredDocumentsForRole(role: Role): DocumentPurpose[] {
    const baseDocs = [
      DocumentPurpose.ID_DOCUMENT,
      DocumentPurpose.PROOF_OF_ADDRESS,
      DocumentPurpose.PROFILE_PICTURE
    ];

    switch (role) {
      case Role.DRIVER:
        return [
          ...baseDocs,
          DocumentPurpose.LICENSE,
          DocumentPurpose.VEHICLE_REGISTRATION,
          DocumentPurpose.VEHICLE_INSPECTION_REPORT
        ];
      case Role.FLEET_OWNER:
        return [
          ...baseDocs,
          DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE,
          DocumentPurpose.TAX_CLEARANCE_CERTIFICATE,
          DocumentPurpose.BUSINESS_LICENSE,
          DocumentPurpose.VEHICLE_REGISTRATION
        ];
      case Role.AGENCY:
        return [
          ...baseDocs,
          DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE,
          DocumentPurpose.TAX_CLEARANCE_CERTIFICATE,
          DocumentPurpose.BUSINESS_LICENSE
        ];
      case Role.ADVERTISER:
        return [
          ...baseDocs,
          DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE
        ];
      default:
        return baseDocs;
    }
  }

  getDocumentName(purpose: DocumentPurpose): string {
    const docMap: Record<DocumentPurpose, string> = {
      [DocumentPurpose.PROFILE_PICTURE]: 'Profile Picture',
      [DocumentPurpose.ID_DOCUMENT]: 'ID Document',
      [DocumentPurpose.PROOF_OF_ADDRESS]: 'Proof of Address',
      [DocumentPurpose.LICENSE]: 'Driver License',
      [DocumentPurpose.VEHICLE_REGISTRATION]: 'Vehicle Registration',
      [DocumentPurpose.VEHICLE_INSURANCE]: 'Vehicle Insurance',
      [DocumentPurpose.VEHICLE_INSPECTION_REPORT]: 'Inspection Report',
      [DocumentPurpose.VEHICLE_PHOTO]: 'Vehicle Photo',
      [DocumentPurpose.ROADWORTHY_CERTIFICATE]: 'Roadworthy Certificate',
      [DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE]: 'Business Registration',
      [DocumentPurpose.BUSINESS_LICENSE]: 'Business License',
      [DocumentPurpose.TAX_CLEARANCE_CERTIFICATE]: 'Tax Clearance',
      [DocumentPurpose.COMPANY_PROFILE]: 'Company Profile',
      [DocumentPurpose.COMPANY_LOGO]: 'Company Logo',
      [DocumentPurpose.BUSINESS_ADDRESS_PROOF]: 'Business Address Proof',
      [DocumentPurpose.CAMPAIGN_VIDEO]: 'Campaign Video',
      [DocumentPurpose.CAMPAIGN_PICTURE]: 'Campaign Picture',
      [DocumentPurpose.OTHER]: 'Other Document'
    };

    return docMap[purpose] || purpose.toString();
  }

  getDocumentIcon(purpose: DocumentPurpose): string {
    const icons: Record<DocumentPurpose, string> = {
      [DocumentPurpose.PROFILE_PICTURE]: '🖼️',
      [DocumentPurpose.ID_DOCUMENT]: '🆔',
      [DocumentPurpose.PROOF_OF_ADDRESS]: '🏠',
      [DocumentPurpose.LICENSE]: '📜',
      [DocumentPurpose.VEHICLE_REGISTRATION]: '🚗',
      [DocumentPurpose.VEHICLE_INSURANCE]: '🛡️',
      [DocumentPurpose.VEHICLE_INSPECTION_REPORT]: '🔍',
      [DocumentPurpose.VEHICLE_PHOTO]: '📷',
      [DocumentPurpose.ROADWORTHY_CERTIFICATE]: '✅',
      [DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE]: '🏢',
      [DocumentPurpose.BUSINESS_LICENSE]: '📋',
      [DocumentPurpose.TAX_CLEARANCE_CERTIFICATE]: '💰',
      [DocumentPurpose.COMPANY_PROFILE]: '🏛️',
      [DocumentPurpose.COMPANY_LOGO]: '🔷',
      [DocumentPurpose.BUSINESS_ADDRESS_PROOF]: '🏢📍',
      [DocumentPurpose.CAMPAIGN_VIDEO]: '🎥',
      [DocumentPurpose.CAMPAIGN_PICTURE]: '📸',
      [DocumentPurpose.OTHER]: '📄'
    };

    return icons[purpose] || '📄';
  }

  getDocumentPurposeLabel(purpose: DocumentPurpose): string {
    return purpose.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  private getFileType(file: File): FileType {
    const type = file.type.split('/')[0];
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (type) {
      case 'image': return FileType.IMAGE;
      case 'video': return FileType.VIDEO;
      case 'audio': return FileType.AUDIO;
      default:
        switch (extension) {
          case 'pdf': return FileType.PDF;
          case 'doc':
          case 'docx': return FileType.WORD;
          case 'xls':
          case 'xlsx': return FileType.EXCEL;
          case 'ppt':
          case 'pptx': return FileType.PPT;
          case 'txt': return FileType.TEXT;
          case 'zip': return FileType.ZIP;
          case 'csv': return FileType.CSV;
          case 'json': return FileType.JSON;
          case 'xml': return FileType.XML;
          case 'html': return FileType.HTML;
          default: return FileType.OTHER;
        }
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'APPROVED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getVehicleImage(vehicle: VehicleInformationrmation): string {
    return vehicle.vehicleImageUrl || 'assets/default-vehicle.jpg';
  }

  getAcceptTypes(purpose: DocumentPurpose): string {
    switch(purpose) {
      case DocumentPurpose.PROFILE_PICTURE:
      case DocumentPurpose.VEHICLE_PHOTO:
        return 'image/*';
      case DocumentPurpose.ID_DOCUMENT:
      case DocumentPurpose.PROOF_OF_ADDRESS:
        return 'image/*,.pdf';
      case DocumentPurpose.LICENSE:
        return 'image/*,.pdf,.doc,.docx';
      default:
        return '*';
    }
  }

  isDocumentUploaded(purpose: DocumentPurpose): boolean {
    return !!this.application?.uploadedDocuments?.some(doc => doc.documentPurpose === purpose);
  }

  canEditApplication(): boolean {
    return this.application?.status?.toUpperCase() === 'PENDING';
  }
}

function saveAs(blob: Blob, arg1: string) {
  throw new Error('Function not implemented.');
}
