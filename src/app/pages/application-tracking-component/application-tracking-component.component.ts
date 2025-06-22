import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApplicationDto, UploadedDocuments } from '../../model/application.dto';
import { DocumentPurpose } from '../../services/document-purpose';
import { ApplicationsService } from '../../services/application.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { VehicleInformation } from '../../model/adverrtiser.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppDocumentViewerComponent } from '../app-document-viewer/app-document-viewer.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Role } from '../../services/role.enum';
import { ROLE_CONFIGS } from '../../services/role.enum';
import { TransportType } from '../../services/transport-type.enum';
import { VehicleType } from '../../services/vehicle-type.enum';
import { environmentApplication } from '../../environments/environment';
import { FileType } from '../../services/file-type';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { FileSizePipe } from "../../pagess-advertiser/campaign/campaign/add-campaign/file-size.pipe";

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
    FileSizePipe
],
  providers: [DatePipe],
})
export class TrackApplicationComponent implements OnInit {
  application: ApplicationDto | null = null;
  loading = true;
  error: string | null = null;
activeTab: 'details' | 'documents' | 'missing' | 'vehicle' = 'details';

  uploadProgress: number | null = null;
  isUploading = false;
  selectedDocumentPurpose: DocumentPurpose | null = null;
selectedFile: File | null = null;

  Role = Role;
  ROLE_CONFIGS = ROLE_CONFIGS;
  DocumentPurpose = DocumentPurpose;
  documentPurposes = Object.values(DocumentPurpose);
  
  licenseTypes = ['Learner', 'Code 8', 'Code 10', 'Code 14', 'Professional Driving Permit', 'International'];
  companyTypes = ['Pty Ltd', 'Sole Proprietor', 'Partnership', 'CC', 'Non-Profit', 'Government'];
 missingDocuments: DocumentPurpose[] = [];


  constructor(
    private route: ActivatedRoute,
    private applicationsService: ApplicationsService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private http: HttpClient,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      if (email) {
        this.fetchApplication(email);
      } else {
        this.error = 'No email provided in URL';
        this.loading = false;
      }
    });
  }

  fetchApplication(email: string): void {
    this.loading = true;
    this.error = null;
    this.applicationsService.getApplicationByEmail(email).subscribe({
      next: (data) => {
        this.application = data[0];
        this.calculateMissingDocuments();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load application. Please try again later.';
        this.loading = false;
        console.error(err);
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

// Update your upload success handler to refresh the missing documents list
private handleUploadSuccess(): void {
  this.snackBar.open('Document uploaded successfully!', 'Close', { duration: 5000 });
  this.resetUploadState();
  
  // Refresh application data and missing documents
  if (this.application?.email) {
    this.fetchApplication(this.application.email);
  }
  
  // If we're on the missing tab and no more missing docs, switch to documents tab
  if (this.activeTab === 'missing' && this.missingDocuments.length === 0) {
    this.activeTab = 'documents';
  }
}
onFileSelected(event: Event, purpose: DocumentPurpose): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    this.selectedFile = input.files[0];
    this.selectedDocumentPurpose = purpose;
    
    // Validate file size (max 5MB)
    if (this.selectedFile.size > 5 * 1024 * 1024) {
      this.snackBar.open('File size should be less than 5MB', 'Close', { duration: 5000 });
      this.selectedFile = null;
      input.value = ''; // Clear the file input
      return;
    }
    
    // Validate file type based on purpose
    if (!this.isValidFileType(this.selectedFile, purpose)) {
      this.snackBar.open('Invalid file type for this document', 'Close', { duration: 5000 });
      this.selectedFile = null;
      input.value = ''; // Clear the file input
      return;
    }
  }
}


  getRequiredDocumentsForRole(role: Role): DocumentPurpose[] {
    const baseDocs = [
      DocumentPurpose.ID_DOCUMENT,
      DocumentPurpose.PROOF_OF_ADDRESS,
      DocumentPurpose.PROFILE_PICTURE
    ];

    switch (role) {
      case Role.DRIVER:
        return [...baseDocs, DocumentPurpose.LICENSE, DocumentPurpose.VEHICLE_REGISTRATION];
      case Role.FLEET_OWNER:
        return [...baseDocs, 
          DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE,
          DocumentPurpose.TAX_CLEARANCE_CERTIFICATE,
          DocumentPurpose.BUSINESS_LICENSE,
          DocumentPurpose.VEHICLE_REGISTRATION
        ];
      case Role.AGENCY:
        return [...baseDocs,
          DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE,
          DocumentPurpose.TAX_CLEARANCE_CERTIFICATE,
          DocumentPurpose.BUSINESS_LICENSE
        ];
      case Role.ADVERTISER:
        return [...baseDocs,
          DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE
        ];
      default:
        return baseDocs;
    }
  }



  isValidFileType(file: File, purpose: DocumentPurpose): boolean {
    const validTypes = this.getAcceptTypes(purpose).split(',');
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileType = file.type.split('/')[0];

    // Check against MIME types
    if (validTypes.some(type => type.trim() === file.type)) {
      return true;
    }

    // Check against file extensions
    if (fileExtension && validTypes.some(type => {
      const ext = type.trim().replace('.', '');
      return ext === fileExtension;
    })) {
      return true;
    }

    // Special cases for images
    if (purpose === DocumentPurpose.PROFILE_PICTURE || purpose === DocumentPurpose.VEHICLE_PHOTO) {
      return fileType === 'image';
    }

    return false;
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

  // Helper methods remain the same...
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

  getVehicleImage(vehicle: VehicleInformation): string {
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
}

function saveAs(blob: Blob, arg1: string) {
  throw new Error('Function not implemented.');
}
