// view-application.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Application, UserDocuments } from '../../../api/Response/interfaceAproval';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-view-application',
  templateUrl: './view-application.component.component.html',
  styleUrl: './view-application.component.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
     MatDialogModule,
     MatTab,
     MatTabGroup,MatChip
  ]
})
export class ViewApplicationComponent {
previewDocument(_t243: UserDocuments) {
throw new Error('Method not implemented.');
}
getDocumentIcon(arg0: string) {
throw new Error('Method not implemented.');
}
  application: Application;
  isLoading = false;
  isDownloading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    public dialogRef: MatDialogRef<ViewApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { application: Application },
    private http: HttpClient
  ) {
    this.application = data.application;
  }

  downloadDocument(document: UserDocuments) {
    if (!this.application.id) return;
    
    this.isDownloading = true;
    const url = `${environment.api}api/applications/${this.application.id}/documents/download?documentPurpose=${document.documentPurpose}`;
    window.open(url, '_blank');
    this.isDownloading = false;
  }

  approveApplication() {
    if (!this.application.id) return;

    this.isLoading = true;
    this.http.post(`${environment.api}api/applications/${this.application.id}/approve`, null)
      .subscribe({
        next: () => {
          this.application.reviewed = true;
          this.application.approved = true;
          this.application.rejected = false;
          this.application.approvalDate = new Date();
          this.successMessage = 'Application approved successfully';
          this.isLoading = false;
          this.dialogRef.close({ action: 'approved', application: this.application });
        },
        error: (err) => {
          this.errorMessage = 'Failed to approve application';
          this.isLoading = false;
          console.error(err);
        }
      });
  }

  rejectApplication() {
    if (!this.application.id) return;

    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      this.isLoading = true;
      this.http.post(`${environment.api}api/applications/${this.application.id}/reject`, { reason })
        .subscribe({
          next: () => {
            this.application.reviewed = true;
            this.application.approved = false;
            this.application.rejected = true;
            this.application.rejectionReason = reason;
            this.successMessage = 'Application rejected successfully';
            this.isLoading = false;
            this.dialogRef.close({ action: 'rejected', application: this.application });
          },
          error: (err) => {
            this.errorMessage = 'Failed to reject application';
            this.isLoading = false;
            console.error(err);
          }
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getStatusClass() {
    if (this.application.approved) return 'approved';
    if (this.application.rejected) return 'rejected';
    return 'pending';
  }

  getStatusText() {
    if (this.application.approved) return 'Approved';
    if (this.application.rejected) return 'Rejected';
    return 'Pending Review';
  }
}