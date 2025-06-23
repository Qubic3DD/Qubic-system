import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse, Application, DocumentPurpose, UserDocuments } from '../../api/Response/interfaceAproval';
import { ViewApplicationComponent } from './view-application.component/view-application.component.component';
import { ApplicationStatus } from '../../services/application-status';
import { Role } from '../../services/role.enum';
import { UploadedDocuments } from '../../model/application.dto';
import { MatList, MatListItem, MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';




@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css'],
imports: [
  // ... other imports
  MatDialogModule,
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  FormsModule ,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  CommonModule
],
  standalone: true
})
export class ApprovalsComponent {
  applications: Application[] = [];
  searchQuery = '';
  filterType = '';
  filterStatus = '';
  filteredApplications: Application[] = [];
 selectedApplication: Application | null = null;
currentAction: 'approve' | 'reject' | 'request-info' | null = null;
  isLoading = false;
  errorMessage = '';
  dialogRef: any;
  data: any;
  router: any;


  successMessage = '';

  // Status enum for template access
  ApplicationStatus = ApplicationStatus;
  DocumentPurpose = DocumentPurpose;
  Role = Role;

  // For document selection
  selectedDocuments: {[key: string]: boolean} = {};
  rejectionReason = '';
// ✅ Don't overwrite ApplicationStatus enum
  statusOptions: ApplicationStatus[] = [
    ApplicationStatus.PENDING,
    ApplicationStatus.APPROVED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.MORE_INFO_REQUIRED
  ];

  constructor(private http: HttpClient,private dialog: MatDialog) {
    this.loadApplications();
    
  }

  // Required documents mapping based on role
  private REQUIRED_DOCUMENTS = {
    [Role.DRIVER]: [
      DocumentPurpose.ID_DOCUMENT,
      DocumentPurpose.LICENSE,
      DocumentPurpose.PROOF_OF_ADDRESS,
      DocumentPurpose.VEHICLE_REGISTRATION
    ],
    [Role.FLEET_OWNER]: [
      DocumentPurpose.ID_DOCUMENT,
      DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE,
      DocumentPurpose.TAX_CLEARANCE_CERTIFICATE,
      DocumentPurpose.VEHICLE_REGISTRATION
    ],
    [Role.AGENCY]: [
      DocumentPurpose.ID_DOCUMENT,
      DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE,
      DocumentPurpose.TAX_CLEARANCE_CERTIFICATE,
      DocumentPurpose.COMPANY_PROFILE
    ],
    [Role.ADVERTISER]: [
      DocumentPurpose.ID_DOCUMENT,
      DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE
    ]
  };

getRequiredDocuments(role: Role): DocumentPurpose[] {
  return this.REQUIRED_DOCUMENTS[role as keyof typeof this.REQUIRED_DOCUMENTS] || [];
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
// Add these methods to your ApprovalsComponent class

isDocumentUploaded(docPurpose: DocumentPurpose): boolean {
  if (!this.selectedApplication?.uploadedDocuments) return false;
  return this.selectedApplication.uploadedDocuments.some(doc => 
    doc.documentPurpose === docPurpose
  );
}

isActionDisabled(): boolean {
  if (this.isLoading) return true;
  
  if (this.currentAction === 'reject') {
    return !this.rejectionReason?.trim();
  }
  
  if (this.currentAction === 'request-info') {
    const selectedCount = Object.values(this.selectedDocuments).filter(v => v).length;
    return selectedCount === 0;
  }
  
  return false;
}

getActionButtonClass(): string {
  let baseClasses = 'px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  
  if (this.currentAction === 'approve') {
    return `${baseClasses} bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 focus:ring-green-500`;
  }
  
  if (this.currentAction === 'reject') {
    return `${baseClasses} bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus:ring-red-500`;
  }
  
  return `${baseClasses} bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:ring-blue-500`;
}

  loadApplications() {
    this.isLoading = true;
    this.http.get<Application[]>(`${environment.api}api/applications/pending`)
      .subscribe({
        next: (response) => {
          this.applications = response.map(app => ({
            ...app,
            submissionDate: app.submissionDate ? new Date(app.submissionDate) : undefined,
            approvalDate: app.approvalDate ? new Date(app.approvalDate) : undefined,
            documents: this.mapDocuments(app),
            applicantName: `${app.firstName} ${app.lastName}`,
            contactEmail: app.email,
            applicationStatus: app.status || ApplicationStatus.PENDING
          }));
          this.filterApplications();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load applications';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

private mapDocuments(app: Application): UploadedDocuments[] {
  if (app.uploadedDocuments && app.uploadedDocuments.length > 0) {
    return app.uploadedDocuments.map(doc => ({
      ...doc,
      name: doc.name ?? 'Unnamed Document',
      downloadUrl: `${environment.api}api/applications/${app.id}/documents/${doc.id}/download`
    }));
  }
  return [];
}


  filterApplications() {
    const query = this.searchQuery.toLowerCase();

    this.filteredApplications = this.applications.filter(app => {
      const matchesSearch = 
        (app.lastName?.toLowerCase().includes(query) || 
         app.phoneNo?.toLowerCase().includes(query) ||
         app.email?.toLowerCase().includes(query));
      
      const matchesType = !this.filterType || app.type === this.filterType;
      
      const matchesStatus = !this.filterStatus || 
        (this.filterStatus === 'pending' && app.status === ApplicationStatus.PENDING) ||
        (this.filterStatus === 'approved' && app.status === ApplicationStatus.APPROVED) ||
        (this.filterStatus === 'rejected' && app.status === ApplicationStatus.REJECTED) ||
        (this.filterStatus === 'more_info' && app.status === ApplicationStatus.MORE_INFO_REQUIRED);

      return matchesSearch && matchesType && matchesStatus;
    });
  }

  refreshApplications() {
    this.loadApplications();
  }

  viewApplication(application: Application) {
    const dialogRef = this.dialog.open(ViewApplicationComponent, {
      width: '80vw',
      maxWidth: '1200px',
      height: '90vh',
      data: { application }
    });

    dialogRef.afterClosed().subscribe((result: { action: string }) => {
      if (result?.action) {
        this.loadApplications();
      }
    });
  }
// In your component.ts, update the openActionDialog method:
openActionDialog(action: 'approve' | 'reject' | 'request-info', application: Application) {
  this.currentAction = action;
  this.selectedApplication = application;
  this.rejectionReason = '';
  this.selectedDocuments = {};

  // Initialize document selection if requesting info
  if (action === 'request-info' && application.roles?.length) {
    const requiredDocs = this.getRequiredDocuments(application.roles[0]);
    const uploadedDocs = application.uploadedDocuments?.map(d => d.documentPurpose) || [];
    
    requiredDocs.forEach(doc => {
      this.selectedDocuments[doc] = !uploadedDocs.includes(doc);
    });
  }
}

  processApplication() {
    if (!this.selectedApplication?.id) return;

    const appId = this.selectedApplication.id;
    let params = new HttpParams();
    let missingDocs: string[] = [];

    if (this.currentAction === 'reject') {
      if (!this.rejectionReason.trim()) {
        this.errorMessage = 'Rejection reason is required';
        return;
      }
      params = params.set('action', ApplicationStatus.REJECTED)
                     .set('reason', this.rejectionReason);
    } 
    else if (this.currentAction === 'request-info') {
      missingDocs = Object.keys(this.selectedDocuments)
                         .filter(key => this.selectedDocuments[key]);
      if (missingDocs.length === 0) {
        this.errorMessage = 'Please select at least one missing document';
        return;
      }
      params = params.set('action', ApplicationStatus.MORE_INFO_REQUIRED)
                     .set('missingDocuments', missingDocs.join(','));
    }
    else {
      params = params.set('action', ApplicationStatus.APPROVED);
    }

    this.isLoading = true;
    this.http.post(`${environment.api}api/applications/${appId}/process`, {}, { params })
      .subscribe({
        next: () => {
          this.successMessage = `Application ${this.currentAction}ed successfully`;
          this.closeActionDialog();
          this.loadApplications();
        },
        error: (err) => {
          this.errorMessage = `Failed to ${this.currentAction} application`;
          console.error(err);
        },
        complete: () => this.isLoading = false
      });
  }

  closeActionDialog() {
    this.selectedApplication = null;
    this.rejectionReason = '';
    this.selectedDocuments = {};
  }
  searchApplications() {
  if (!this.searchQuery) {
    this.filterApplications();
    return;
  }

  // Check if search query is an email
  if (this.isValidEmail(this.searchQuery)) {
    this.fetchApplicationByEmail(this.searchQuery);
  } else {
    // Fall back to regular filtering for non-email searches
    this.filterApplications();
  }
}
private isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}private fetchApplicationByEmail(email: string) {
  if (!this.isValidEmail(email)) {
    this.errorMessage = 'Invalid email format.';
    return;
  }

  this.isLoading = true;
  const encodedEmail = encodeURIComponent(email.trim().toLowerCase());
  const apiUrl = `http://41.76.110.219:8443/api/applications/application-by-email?email=${encodedEmail}`; // ✅ Updated to use query param

  console.log(`curl -X 'GET' '${apiUrl}' -H 'accept: */*'`);

  this.http.get<Application>(apiUrl).subscribe({
    next: (response) => {
      this.isLoading = false;
      if (response?.email?.toLowerCase() === email.trim().toLowerCase()) {
        this.router.navigate(['/application', email]);
      } else {
        this.errorMessage = 'No application found for this email.';
        this.filterApplications();
      }
    },
    error: (error) => {
      this.isLoading = false;
      if (error.status === 404) {
        this.errorMessage = 'No application found for this email.';
        this.filterApplications();
      } else {
        this.errorMessage = 'Failed to search application. Please try again.';
        console.error(error);
      }
    }
  });
}


  get totalApplications(): number {
    return this.filteredApplications.length;
  }

  get pendingReviewApplications(): number {
    return this.filteredApplications.filter(app => !app.reviewed).length;
  }

get approvedTodayApplications(): number {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime();

  return this.filteredApplications.filter(app => {
    if (!app.approved || !app.approvalDate) return false;

    const approvalTime = app.approvalDate instanceof Date 
      ? app.approvalDate.getTime()
      : new Date(app.approvalDate).getTime();

    return approvalTime >= startOfToday && approvalTime < startOfTomorrow;
  }).length;
}



 closeDialog(): void {
    this.dialogRef.close();
  }

  getStatusClass(): string {
    if (this.data.application.approved) return 'approved';
    if (this.data.application.rejected) return 'rejected';
    return 'pending';
  }


  approveApplication(app: Application) {
    this.http.post(`${environment.api}api/applications/${app.id}/approve`, null)
      .subscribe({
        next: () => {
          app.reviewed = true;
          app.approved = true;
          app.rejected = false;
          app.approvalDate = new Date();
          this.closeModal();
          this.filterApplications();
        },
        error: (err) => {
          this.errorMessage = 'Failed to approve application';
          console.error(err);
        }
      });
  }

  rejectApplication(app: Application) {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      this.http.post(`${environment.api}api/applications/${app.id}/reject`, { reason })
        .subscribe({
          next: () => {
            app.reviewed = true;
            app.approved = false;
            app.rejected = true;
            app.rejectionReason = reason;
        
            this.filterApplications();
          },
          error: (err) => {
            this.errorMessage = 'Failed to reject application';
            console.error(err);
          }
        });
    }
  }

downloadDocument(appId: number, documentPurpose: string) {
    if (!appId) {
      console.error('Invalid application ID');
      return;
    }
    window.open(`${environment.api}api/applications/${appId}/documents/download?documentPurpose=${documentPurpose}`, '_blank');
  }


  closeModal() {
    this.selectedApplication = null;
  }

  getStatusText(app: Application): string {
    if (app.approved) return 'Approved';
    if (app.rejected) return 'Rejected';
    return 'Pending Review';
  }

getApplicationTypeDisplay(type?: string): string {
  if (!type) return 'Unknown';
  switch(type.toLowerCase()) {
    case 'driver': return 'Driver';
    case 'advertiser': return 'Advertiser';
    case 'agency': return 'Agency';
    default: return type;
  }
}

}