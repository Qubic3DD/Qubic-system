import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';

import { environment } from '../../../environments/environment';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Application } from '../../../api/Response/interfaceAproval';
import { UploadedDocuments } from '../../../model/application.dto';
import { ApplicationStatus } from '../../../services/application-status';
import { DocumentPurpose } from '../../../services/document-purpose';
@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.component.html',
  styleUrl: './view-application.component.component.css',
    imports: [CommonModule ,FormsModule, MatInputModule, MatButtonModule,   MatListModule,  
            MatDialogModule, MatCardModule, MatSelectModule, MatIconModule,  MatProgressSpinnerModule,  MatFormFieldModule],
})
export class ViewApplicationComponent implements OnInit {
  application: Application;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isDownloading = false;
  currentDocument: UploadedDocuments | null = null;
  documentViewerUrl: SafeResourceUrl | null = null;
  viewerMode: 'image' | 'pdf' | 'unsupported' = 'unsupported';
  documentViewerVisible = false;

  // Enums for template access
  DocumentPurpose = DocumentPurpose;
  ApplicationStatus = ApplicationStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { application: Application },
    private dialogRef: MatDialogRef<ViewApplicationComponent>,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {
    this.application = this.mapApplication(data.application);
  }

  ngOnInit(): void {
    this.currentDocument = this.application.uploadedDocuments?.[0] || null;
  }

  private mapApplication(app: Application): Application {
    return {
      ...app,
      submissionDate: app.submissionDate ? new Date(app.submissionDate) : undefined,
      approvalDate: app.approvalDate ? new Date(app.approvalDate) : undefined,
      uploadedDocuments: app.uploadedDocuments?.map(doc => ({
        ...doc,
        name: doc.name || this.getDocumentName(doc.documentPurpose),
        downloadUrl: `${environment.api}api/applications/${app.id}/documents/${doc.id}/download`,
        viewUrl: this.getDocumentViewUrl(app.id!, doc.id, doc.fileType)
      })) || []
    };
  }

  private getDocumentViewUrl(appId: number, docId: number, fileType?: string): string | null {
    if (!fileType) return null;
    const baseUrl = `${environment.api}api/applications/${appId}/documents/${docId}/view`;
    
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

  getApplicationType(): string {
    if (!this.application.type) return 'Unknown';
    switch(this.application.type.toLowerCase()) {
      case 'driver': return 'Driver';
      case 'advertiser': return 'Advertiser';
      case 'agency': return 'Agency';
      case 'fleet_owner': return 'Fleet Owner';
      default: return this.application.type;
    }
  }

downloadDocument(document: UploadedDocuments): void {
  if (!this.application?.id || !document?.documentPurpose) return;
  const url = `${environment.api}api/applications/${this.application.id}/documents/download?documentPurpose=${document.documentPurpose}`;
  window.open(url, '_blank');
}

viewDocument(document: UploadedDocuments): void {
  if (!this.application?.id || !document?.documentPurpose) return;
  const url = `${environment.api}api/applications/${this.application.id}/documents/view?documentPurpose=${document.documentPurpose}`;
  window.open(url, '_blank');
}


  closeDocumentViewer() {
    this.documentViewerVisible = false;
    this.documentViewerUrl = null;
  }

  approveApplication() {
    if (!this.application.id || this.isLoading) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.post(`${environment.api}api/applications/${this.application.id}/approve`, null)
      .subscribe({
        next: () => {
          this.successMessage = 'Application approved successfully';
          this.application.status = ApplicationStatus.APPROVED;
          this.application.approvalDate = new Date();
          this.snackBar.open(this.successMessage, 'Close', { duration: 5000 });
          this.dialogRef.close({ action: 'approved' });
        },
        error: (err) => {
          this.errorMessage = 'Failed to approve application';
          console.error(err);
          this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        },
        complete: () => this.isLoading = false
      });
  }

  rejectApplication() {
    if (!this.application.id || this.isLoading) return;
    
    const reason = prompt('Please enter the reason for rejection:');
    if (!reason) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.post(`${environment.api}api/applications/${this.application.id}/reject`, { reason })
      .subscribe({
        next: () => {
          this.successMessage = 'Application rejected successfully';
          this.application.status = ApplicationStatus.REJECTED;
          this.application.rejectionReason = reason;
          this.snackBar.open(this.successMessage, 'Close', { duration: 5000 });
          this.dialogRef.close({ action: 'rejected' });
        },
        error: (err) => {
          this.errorMessage = 'Failed to reject application';
          console.error(err);
          this.snackBar.open(this.errorMessage, 'Close', { duration: 5000 });
        },
        complete: () => this.isLoading = false
      });
  }

  requestMoreInfo() {
    if (!this.application.id || this.isLoading) return;
    
    const missingDocs = prompt('Please list the required additional documents (comma separated):');
    if (!missingDocs) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const params = new HttpParams()
      .set('action', ApplicationStatus.MORE_INFO_REQUIRED)
      .set('missingDocuments', missingDocs);
    
    this.http.post(`${environment.api}api/applications/${this.application.id}/process`, {}, { params })
      .subscribe({
        next: () => {
          this.successMessage = 'Information request sent successfully';
          this.application.status = ApplicationStatus.MORE_INFO_REQUIRED;
          this.snackBar.open(this.successMessage, 'Close', { duration: 5000 });
          this.dialogRef.close({ action: 'info-requested' });
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
}