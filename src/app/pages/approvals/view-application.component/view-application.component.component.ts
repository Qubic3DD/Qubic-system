import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpEventType, HttpParams } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment, environmentApplication } from '../../../environments/environment';
// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';


import { ApplicationDto, UploadedDocuments } from '../../../model/application.dto';
import { ApplicationStatus } from '../../../services/application-status';
import { DocumentPurpose } from '../../../services/document-purpose';
import { VehicleInformationrmation } from '../../../model/adverrtiser.model';
import { FileType } from '../../../services/file-type';
import { TransportType } from '../../../services/transport-type.enum';
import { VehicleType } from '../../../services/vehicle-type.enum';
import { RejectDialogComponent } from './reject-dialog.component';
import { RequestInfoDialogComponent } from './request-info-dialog.component';
import { AddVehicleDialogComponent } from './add-document.component';
import { Role } from '../../../services/role.enum';
import { FileSizePipe } from '../../../pagess-advertiser/campaign/campaign/add-campaign/file-size.pipe';
import { Observable, map, catchError, of, shareReplay, switchMap, throwError } from 'rxjs';
import { VehicleImageResponse, VehicleService } from '../../../services/vehicle.service';
import { Application } from '../../../api/Response/interfaceAproval';
import { ActivatedRoute } from '@angular/router';
import { ApplicationsService } from '../../../services/application.service';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.component.html',
  styleUrls: ['./view-application.component.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    FileSizePipe
  ],
  providers: [DatePipe]
})
export class ViewApplicationComponent implements OnInit {
vehicle: any;
getProfileImageUrl() {
throw new Error('Method not implemented.');
}
  application: ApplicationDto;
  isLoading = false;
  isUploading = false;
  uploadProgress = 0;
  errorMessage = '';
  successMessage = '';
  isDownloading = false;
  currentDocument: UploadedDocuments | null = null;
  documentViewerUrl: SafeResourceUrl | null = null;
  viewerMode: 'image' | 'pdf' | 'unsupported' = 'unsupported';
  documentViewerVisible = false;
  missingDocuments: DocumentPurpose[] = [];
  selectedFile: File | null = null;
  selectedDocumentPurpose: DocumentPurpose | null = null;
  showVehicleForm = false;
  newVehicle: Partial<VehicleInformationrmation> = {};
  vehicleImageFile: File | null = null;
  vehicleImagePreview: string | null = null;
  isEditingVehicle = false;
  imageCache = new Map<number, Observable<string | null>>();
  activeTab: 'details' | 'documents' | 'missing' | 'vehicle' = 'details';






  loading = true;
  error: string | null = null;
  
  private apiUrl = environmentApplication.api + 'images/';

  vehicleTypes = Object.values(VehicleType).filter(value => typeof value === 'string') as string[];
  transportTypes = Object.values(TransportType).filter(value => typeof value === 'string') as string[];

Role: any;

i: any;

  // Enums and lists for template
  DocumentPurpose = DocumentPurpose;
  ApplicationStatus = ApplicationStatus;
  VehicleType = VehicleType;
  TransportType = TransportType;

  private readonly validFileTypes: { [key in DocumentPurpose]: string[] } = {
    [DocumentPurpose.PROFILE_PICTURE]: ['image/jpeg', 'image/png', 'image/gif'],
    [DocumentPurpose.ID_DOCUMENT]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.PROOF_OF_ADDRESS]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.LICENSE]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.VEHICLE_REGISTRATION]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.VEHICLE_INSURANCE]: ['application/pdf'],
    [DocumentPurpose.VEHICLE_INSPECTION_REPORT]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.VEHICLE_PHOTO]: ['image/jpeg', 'image/png'],
    [DocumentPurpose.ROADWORTHY_CERTIFICATE]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.BUSINESS_LICENSE]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.TAX_CLEARANCE_CERTIFICATE]: ['application/pdf'],
    [DocumentPurpose.COMPANY_PROFILE]: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    [DocumentPurpose.COMPANY_LOGO]: ['image/jpeg', 'image/png', 'image/svg+xml'],
    [DocumentPurpose.BUSINESS_ADDRESS_PROOF]: ['application/pdf', 'image/jpeg', 'image/png'],
    [DocumentPurpose.CAMPAIGN_VIDEO]: ['video/mp4', 'video/quicktime'],
    [DocumentPurpose.CAMPAIGN_PICTURE]: ['image/jpeg', 'image/png', 'image/gif'],
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
environment: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { application: ApplicationDto },
    private dialogRef: MatDialogRef<ViewApplicationComponent>,
    private route: ActivatedRoute,
    private applicationsService: ApplicationsService,
    private vehicleService: VehicleService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private http: HttpClient,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar

  ) {
    this.application = this.mapApplication(data.application);
  }

  ngOnInit(): void {
    this.currentDocument = this.application.uploadedDocuments?.[0] || null;
    this.loadMissingDocuments();
    this.loadVehicles();
  }
  getDocumentPurposeLabel(purpose: DocumentPurpose): string {
    return purpose.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

    private loadMissingDocuments(): void {
    if (!this.application.id) {
      this.calculateMissingDocuments();
      return;
    }

    this.http.get<DocumentPurpose[]>(
      `${environmentApplication.api}api/applications/${this.application.id}/missing-documents`
    ).subscribe({
      next: (missingDocs) => {
        this.missingDocuments = missingDocs;
        if (missingDocs.length === 0) {
          this.calculateMissingDocuments();
        }
      },
      error: () => {
        this.calculateMissingDocuments();
      }
    });
  }
  cancelAddVehicle(): void {
    this.showVehicleForm = false;
    this.resetVehicleForm();
  }

  private calculateMissingDocuments(): void {
    if (!this.application.roles || this.application.roles.length === 0) {
      this.missingDocuments = [];
      return;
    }

    const requiredDocs = this.getRequiredDocumentsForRole(this.application.roles[0]);
    const uploadedDocTypes = this.application.uploadedDocuments?.map(d => d.documentPurpose) || [];
    
    this.missingDocuments = requiredDocs.filter(docType => 
      !uploadedDocTypes.includes(docType)
    );
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

  private loadVehicles(): void {
    if (!this.application.id) return;
    
    this.isLoading = true;
    this.http.get<VehicleInformationrmation[]>(

      `${environmentApplication.api}vehicles/application/${this.application.id}`
    ).subscribe({
      next: (vehicles) => {
        this.application.VehicleInformationrmation = vehicles;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load vehicles', err);
        this.isLoading = false;
      }
    });
  }


  private mapApplication(app: ApplicationDto): ApplicationDto {
    return {
      ...app,

      approvalDate: app.approvalDate ? new Date(app.approvalDate) : undefined,
      uploadedDocuments: app.uploadedDocuments?.map(doc => ({
        ...doc,
        name: doc.name || this.getDocumentName(doc.documentPurpose),
        downloadUrl: `${environmentApplication.api}applications/${app.id}/documents/${doc.id}/download`,
        viewUrl: this.getDocumentViewUrl(app.id!, doc.id, doc.fileType)
      })) || []
    };
  }

  private getDocumentViewUrl(appId: number, docId: number, fileType?: string): string | null {
    if (!fileType) return null;
    const baseUrl = `${environmentApplication.api}applications/${appId}/documents/${docId}/view`;
    
    if (fileType.includes('image')) {
      return baseUrl;
    } else if (fileType.includes('pdf')) {
      return `${baseUrl}?disposition=inline`;
    }
    return null;
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

  getStatusClass(): string {
    if (this.application.status === ApplicationStatus.APPROVED) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (this.application.status === ApplicationStatus.REJECTED) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (this.application.status === ApplicationStatus.MORE_INFO_REQUIRED) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }

  getStatusText(): string {
    if (this.application.status === ApplicationStatus.APPROVED) return 'Approved';
    if (this.application.status === ApplicationStatus.REJECTED) return 'Rejected';
    if (this.application.status === ApplicationStatus.MORE_INFO_REQUIRED) return 'More Info Required';
    return 'Pending Review';
  }

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

  calculateAge(birthDate: string | Date | null | undefined): number {
    if (!birthDate) return 0;

    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  downloadDocument(document: UploadedDocuments): void {
    if (!this.application?.id || !document?.id) return;
    
    this.isDownloading = true;
    this.http.get(
      `${environmentApplication.api}applications/${this.application.id}/documents/${document.id}/download`,
      { responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        saveAs(blob, document.name || `${document.documentPurpose}_${new Date().getTime()}`);
        this.isDownloading = false;
      },
      error: (err) => {
        console.error('Error downloading document:', err);
        this.snackBar.open('Failed to download document', 'Close', { duration: 3000 });
        this.isDownloading = false;
      }
    });
  }
  canEditApplication(): boolean {
    return this.application?.status?.toUpperCase() === 'PENDING';
  }
  addVehicle(): void {
    this.showVehicleForm = true;
    this.isEditingVehicle = false;
    this.resetVehicleForm();
  }

  submitVehicle(): void {
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
  
private handleVehicleSuccess(): void {
  this.snackBar.open(`Vehicle ${this.isEditingVehicle ? 'updated' : 'added'} successfully!`, 'Close', { duration: 5000 });
  this.fetchApplication(this.application!.email);
  this.showVehicleForm = false;
  this.resetVehicleForm();
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
 

    resetVehicleForm(): void {
      this.newVehicle = {
        transportType: TransportType.TAXI,
        vehicleType: VehicleType.HATCH
      };
      this.vehicleImageFile = null;
      this.vehicleImagePreview = null;
    }
  
  viewDocument(document: UploadedDocuments): void {
    if (!this.application?.id || !document?.id) return;
    
    this.isLoading = true;
    this.http.get(
      `${environmentApplication.api}applications/${this.application.id}/documents/${document.documentPurpose}/view`,
      { responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        const fileURL = URL.createObjectURL(blob);
        this.documentViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
        
        if (document.fileType?.includes('image')) {
          this.viewerMode = 'image';
        } else if (document.fileType?.includes('pdf')) {
          this.viewerMode = 'pdf';
        } else {
          this.viewerMode = 'unsupported';
        }
        
        this.documentViewerVisible = true;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error viewing document:', err);
        this.snackBar.open('Failed to view document', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  closeDocumentViewer() {
    this.documentViewerVisible = false;
    this.documentViewerUrl = null;
  }

  onFileSelected(event: Event, purpose: DocumentPurpose): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size should be less than 5MB', 'Close', { duration: 3000 });
        return;
      }
      
      if (!this.isValidFileType(file, purpose)) {
        this.snackBar.open('Invalid file type for this document', 'Close', { duration: 3000 });
        return;
      }
      
      this.selectedFile = file;
      this.selectedDocumentPurpose = purpose;
    }
  }

  isValidFileType(file: File, purpose: DocumentPurpose): boolean {
    const allowedTypes = this.validFileTypes[purpose];
    if (!allowedTypes) return false;
    
    const fileType = file.type === '' ? 
      this.getFileTypeFromExtension(file.name) : 
      file.type;

    return allowedTypes.includes(fileType);
  }

  private getFileTypeFromExtension(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'jpg': case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'gif': return 'image/gif';
      case 'pdf': return 'application/pdf';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls': return 'application/vnd.ms-excel';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'mp4': return 'video/mp4';
      case 'mov': return 'video/quicktime';
      case 'svg': return 'image/svg+xml';
      default: return 'application/octet-stream';
    }
  }

  uploadDocument(): void {
    if (!this.selectedFile || !this.selectedDocumentPurpose || !this.application?.id) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('documentPurpose', this.selectedDocumentPurpose);
    formData.append('fileType', this.getFileType(this.selectedFile));

    this.isUploading = true;
    this.uploadProgress = 0;

    this.http.post(
      `${environmentApplication.api}applications/${this.application.id}/documents/upload`,
      formData,
      { reportProgress: true, observe: 'events' }
    ).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / (event.total || 1));
        } else if (event.type === HttpEventType.Response) {
          this.handleUploadSuccess();
        }
      },
      error: (error) => {
        this.handleUploadError(error);
      }
    });
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
          case 'doc': case 'docx': return FileType.WORD;
          case 'xls': case 'xlsx': return FileType.EXCEL;
          case 'ppt': case 'pptx': return FileType.PPT;
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

  private handleUploadSuccess(): void {
    this.snackBar.open('Document uploaded successfully', 'Close', { duration: 3000 });
    this.resetUploadState();
    this.loadApplicationDocuments();
    this.loadMissingDocuments();
    
    if (this.activeTab === 'missing' && this.missingDocuments.length === 0) {
      this.activeTab = 'documents';
    }
  }

  private handleUploadError(error: any): void {
    console.error('Error uploading document:', error);
    this.snackBar.open('Failed to upload document', 'Close', { duration: 3000 });
    this.resetUploadState();
  }

  private resetUploadState(): void {
    this.isUploading = false;
    this.uploadProgress = 0;
    this.selectedFile = null;
    this.selectedDocumentPurpose = null;
  }

  private loadApplicationDocuments(): void {
    if (!this.application.id) return;
    
    this.http.get<UploadedDocuments[]>(
      `${environmentApplication.api}applications/${this.application.id}/documents`
    ).subscribe({
      next: (documents) => {
        this.application.uploadedDocuments = documents.map(doc => ({
          ...doc,
          name: doc.name || this.getDocumentName(doc.documentPurpose),
          downloadUrl: `${environmentApplication.api}applications/${this.application.id}/documents/${doc.id}/download`,
          viewUrl: this.getDocumentViewUrl(this.application.id!, doc.id, doc.fileType)
        }));
      },
      error: (err) => {
        console.error('Failed to load documents', err);
      }
    });
  }

  deleteDocument(document: UploadedDocuments): void {
    if (!this.application?.id || !document?.id) return;

    if (confirm(`Are you sure you want to delete this ${this.getDocumentName(document.documentPurpose)} document?`)) {
      this.isLoading = true;
      
      this.http.delete(
        `${environmentApplication.api}applications/${this.application.id}/documents/${document.id}`
      ).subscribe({
        next: () => {
          this.snackBar.open('Document deleted successfully', 'Close', { duration: 3000 });
          this.loadApplicationDocuments();
          this.loadMissingDocuments();
        },
        error: (err) => {
          console.error('Error deleting document:', err);
          this.snackBar.open('Failed to delete document', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  // Vehicle methods
  openAddVehicleDialog(): void {
    const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
      width: '600px',
      data: { applicationId: this.application.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadVehicles();
      }
    });
  }

  editVehicle(vehicle: VehicleInformationrmation): void {
    const dialogRef = this.dialog.open(AddVehicleDialogComponent, {
      width: '600px',
      data: { 
        applicationId: this.application.id,
        vehicle: vehicle 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadVehicles();
      }
    });
  }

  deleteVehicle(vehicleId: number): void {
    if (!vehicleId) return;

    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.isLoading = true;
      
      this.http.delete(
        `${environmentApplication.api}vehicles/${vehicleId}`
      ).subscribe({
        next: () => {
          this.snackBar.open('Vehicle deleted successfully', 'Close', { duration: 3000 });
          this.loadVehicles();
        },
        error: (err) => {
          console.error('Error deleting vehicle:', err);
          this.snackBar.open('Failed to delete vehicle', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  getVehicleImageUrl(vehicleId: number): Observable<string | null> {
    if (this.imageCache.has(vehicleId)) {
      return this.imageCache.get(vehicleId)!;
    }

    const imageUrl$ = this.http.get<VehicleImageResponse[]>(
      `${environmentApplication.api}vehicles/${vehicleId}/images`
    ).pipe(
      map(images => {
        if (!images || images.length === 0) return null;
        return `${environmentApplication.api}vehicles/images/${images[0].id}`;
      }),
      catchError(error => {
        console.error(`Failed to get image for vehicle ${vehicleId}`, error);
        return of(null);
      }),
      shareReplay(1)
    );

    this.imageCache.set(vehicleId, imageUrl$);
    return imageUrl$;
  }

  getVehicleTypeName(type: VehicleType): string {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  getTransportTypeName(type: TransportType): string {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

// Application processing methods
approveApplication() {
  if (!this.application.id || this.isLoading) return;

  this.isLoading = true;
  this.errorMessage = '';

  this.http.put(`${environmentApplication.api}applications/${this.application.id}/approve`, null)
    .subscribe({
      next: () => {
        this.successMessage = 'Application approved successfully';
        this.application.status = ApplicationStatus.APPROVED;
        this.application.approvalDate = new Date();
        this.snackBar.open(this.successMessage, 'Close', { duration: 5000 });
        this.dialogRef.close({ action: 'approved', application: this.application });
      },
      error: (err) => {
        this.errorMessage = 'Failed to approve application';
        console.error(err);
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      },
      complete: () => this.isLoading = false
    });
}


  openRejectDialog(): void {
    const dialogRef = this.dialog.open(RejectDialogComponent, {
      width: '500px',
      panelClass: 'modern-dialog',
      data: { 
        application: this.application,
        missingDocuments: this.missingDocuments,
        uploadedDocuments: this.application.uploadedDocuments?.map(d => d.documentPurpose) || []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rejectApplication(result.reason, result.missingDocs);
      }
    });
  }
rejectApplication(reason: string, missingDocs: DocumentPurpose[] = []): void {
  if (!this.application.id || this.isLoading) return;

  this.isLoading = true;
  this.errorMessage = '';

  const params = new HttpParams().set('reason', reason);


  this.http.put(`${environmentApplication.api}applications/${this.application.id}/reject`, { params })
    .subscribe({
      next: () => {
        this.successMessage = 'Application rejected successfully';
        this.application.status = ApplicationStatus.REJECTED;
        this.application.rejectionReason = reason;
        this.snackBar.open(this.successMessage, 'Close', { duration: 5000 });
        this.dialogRef.close({ action: 'rejected', application: this.application });
      },
      error: (err) => {
        this.errorMessage = 'Failed to reject application';
        console.error(err);
        this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
      },
      complete: () => this.isLoading = false
    });
}

  openRequestInfoDialog(): void {
    const dialogRef = this.dialog.open(RequestInfoDialogComponent, {
      width: '500px',
      panelClass: 'modern-dialog',
      data: { 
        missingDocuments: this.missingDocuments,
        uploadedDocuments: this.application.uploadedDocuments?.map(d => d.documentPurpose) || []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.requestMoreInfo(result.missingDocs, result.additionalInfo);
      }
    });
  }

  requestMoreInfo(missingDocs: DocumentPurpose[] = [], additionalInfo: string = ''): void {
    if (!this.application.id || this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const payload = {
      missingDocuments: missingDocs.map(d => d.toString()),
      additionalInfo
    };

    this.http.post(`${environmentApplication.api}applications/${this.application.id}/request-info`, payload)
      .subscribe({
        next: () => {
          this.successMessage = 'Information request sent successfully';
          this.application.status = ApplicationStatus.MORE_INFO_REQUIRED;
          this.snackBar.open(this.successMessage, 'Close', { duration: 5000 });
          this.dialogRef.close({ action: 'info-requested', application: this.application });
        },
        error: (err) => {
          this.errorMessage = 'Failed to send information request';
          console.error(err);
          this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        },
        complete: () => this.isLoading = false
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  isDocumentUploaded(purpose: DocumentPurpose): boolean {
    return !!this.application.uploadedDocuments?.some(doc => doc.documentPurpose === purpose);
  }

  getAcceptTypes(purpose: DocumentPurpose): string {
    const types = this.validFileTypes[purpose];
    if (!types) return '*';
    
    return types.map(t => {
      if (t === 'image/jpeg') return 'image/jpg,image/jpeg';
      if (t === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '.docx';
      if (t === 'application/msword') return '.doc';
      if (t === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') return '.xlsx';
      if (t === 'application/vnd.ms-excel') return '.xls';
      return t;
    }).join(',');
  }
}

function saveAs(blob: Blob, arg1: string) {
  throw new Error('Function not implemented.');
}
