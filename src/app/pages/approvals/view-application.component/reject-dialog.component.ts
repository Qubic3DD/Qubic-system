import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DocumentPurpose } from '../../../services/document-purpose';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  imports: [
  MatDialogModule,
  MatDialogActions,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatSelectModule,
    CommonModule,
  MatOptionModule,
  ReactiveFormsModule,
  MatSelectionList
],
standalone:true,
  selector: 'app-reject-dialog',
  template: `
    <h2 mat-dialog-title>Reject Application</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4">
        <mat-form-field appearance="outline">
          <mat-label>Reason for rejection</mat-label>
          <textarea matInput formControlName="reason" required></textarea>
        </mat-form-field>

        <div *ngIf="data.missingDocuments.length > 0">
          <h3 class="text-sm font-medium mb-2">Missing Documents (Optional)</h3>
          <mat-selection-list formControlName="missingDocs">
            <mat-list-option *ngFor="let doc of data.missingDocuments" [value]="doc">
              {{ getDocumentName(doc) }}
            </mat-list-option>
          </mat-selection-list>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="warn" [disabled]="!form.valid" (click)="onSubmit()">
        Reject Application
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 400px;
    }
    textarea {
      min-height: 100px;
    }
  `]
})
export class RejectDialogComponent {
  form: FormGroup;
  DocumentPurpose = DocumentPurpose;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { missingDocuments: DocumentPurpose[] }
  ) {
    this.form = this.fb.group({
      reason: [''],
      missingDocs: [[]]
    });
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

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        reason: this.form.value.reason,
        missingDocs: this.form.value.missingDocs
      });
    }
  }
}