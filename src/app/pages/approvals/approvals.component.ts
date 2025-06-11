import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse, Application, UserDocuments } from '../../api/Response/interfaceAproval';
import { ViewApplicationComponent } from './view-application.component/view-application.component.component';




@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css'],
  imports: [CommonModule ,FormsModule, MatInputModule, MatButtonModule, 
            MatDialogModule, MatCardModule, MatSelectModule, MatIconModule, MatFormFieldModule],
  standalone: true
})
export class ApprovalsComponent {
  applications: Application[] = [];
  searchQuery = '';
  filterType = '';
  filterStatus = '';
  filteredApplications: Application[] = [];
  selectedApplication: Application | null = null;
  isLoading = false;
  errorMessage = '';
  dialogRef: any;
  dialog: any;
  data: any;

  constructor(private http: HttpClient,) {
    this.loadApplications();
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
          contactEmail: app.email
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

  
private mapDocuments(app: Application): UserDocuments[] {
    const documents: UserDocuments[] = [];

    // Map ID document if exists
    if (app.idNumber) {
      documents.push({
        id: app.id || 0,
        name: 'ID Document',
        fileType: 'application/pdf',
        documentPurpose: 'ID_DOCUMENT',
        creationDate: new Date().toISOString(),
        downloadUrl: `${environment.api}api/applications/${app.id}/documents/download?documentPurpose=ID_DOCUMENT`
      });
    }

    // Map license document if exists
    if (app.licenseType) {
      documents.push({
        id: app.id || 0,
        name: 'License Document',
        fileType: 'application/pdf',
        documentPurpose: 'LICENSE',
        creationDate: new Date().toISOString(),
        downloadUrl: `${environment.api}api/applications/${app.id}/documents/download?documentPurpose=LICENSE`
      });
    }

    return documents;
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

filterApplications() {
  const query = this.searchQuery.toLowerCase();

  this.filteredApplications = this.applications.filter(app => {
    const lastName = app.lastName?.toLowerCase() || '';
    const phone = app.phoneNo?.toLowerCase() || '';

    const matchesSearch = lastName.includes(query) || phone.includes(query);
    const matchesType = !this.filterType || app.type === this.filterType;
    const matchesStatus = !this.filterStatus || 
                         (this.filterStatus === 'pending' && !app.reviewed) ||
                         (this.filterStatus === 'approved' && app.approved) ||
                         (this.filterStatus === 'rejected' && app.rejected);

    return matchesSearch && matchesType && matchesStatus;
  });
}


  refreshApplications() {
    this.loadApplications();
  }

  
viewApplication(application: Application) {
    const dialogRef = this.dialog.open(ViewApplicationComponent, {
      width: '700px',
      data: { application },
      panelClass: 'custom-dialog-container' // Optional: for custom styling
    });

    dialogRef.afterClosed().subscribe((result: { action: string }) => {
      if (result?.action === 'approved' || result?.action === 'rejected') {
        this.loadApplications(); // Refresh your applications list
      }
    });
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