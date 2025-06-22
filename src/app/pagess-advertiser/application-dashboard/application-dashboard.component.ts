// src/app/application-dashboard/application-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApplicationDto, UploadedDocuments } from '../../model/application.dto';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReplaceUnderscorePipe } from "../replace-underscore.pipe.spec";
import { ApplicationDocument } from '../../api/Response/interfaceAproval';
import { DocumentPurpose } from '../../services/document-purpose';

@Component({
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.css'],
      imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatMenuModule,
    NgxChartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReplaceUnderscorePipe
]
})
export class ApplicationDashboardComponent implements OnInit {
  application: ApplicationDto | null = null;
  isLoading = true;
  errorMessage = '';
  selectedFile: File | null = null;
  selectedDocumentType: DocumentPurpose = DocumentPurpose.ID_DOCUMENT;
  documentPurposes = Object.values(DocumentPurpose);
  apiUrl = environment.api;
  router: any;
  email!: string; // or `email: string | null = null;` if you want to handle null explicitly


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

ngOnInit(): void {
  const email = this.route.snapshot.paramMap.get('email');
  if (email) {
    this.email = email; // Set this.email
    this.fetchApplication(); // Call without arguments
  } else {
    this.errorMessage = 'No email provided';
    this.isLoading = false;
  }
}

fetchApplication(): void {
  if (!this.email) {
    this.errorMessage = 'Please enter an email address';
    return;
  }

  if (!this.isValidEmail(this.email)) {
    this.errorMessage = 'Please enter a valid email address';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  const encodedEmail = encodeURIComponent(this.email.trim().toLowerCase());
// const apiUrl = `http://41.76.110.219:8443/api/applications/by-email?email=${encodedEmail}`;

  this.http.get<ApplicationDto>("http://41.76.110.219:8443/api/applications/by-email/jane.doe%40example.com").subscribe({
    next: (response: ApplicationDto) => {
      this.isLoading = false;

      // Extra safety: compare normalized emails
      if (response?.email?.toLowerCase() === this.email.trim().toLowerCase()) {
        this.router.navigate(['/application', this.email]);
      } else {
        this.errorMessage = 'No application found for this email.';
      }
    },
    error: (error) => {
      this.isLoading = false;
      console.error('Error fetching application:', error);

      if (error.status === 404) {
        this.errorMessage = 'No application found for this email.';
      } else if (
        error.status === 500 &&
        error.error?.errorDetails?.includes('No static resource')
      ) {
        this.errorMessage = 'Server misconfiguration. Please check the backend routing.';
      } else {
        this.errorMessage =
          error.error?.message || 'Failed to fetch application. Please try again later.';
      }
    }
  });
}



  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  isValidEmail(email: string): boolean {
    // Basic regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  uploadDocument(): void {
    if (!this.selectedFile || !this.application) {
      this.errorMessage = 'Please select a file and document type';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('documentPurpose', this.selectedDocumentType);

    this.isLoading = true;
    this.http.post<ApplicationDto>(
      `${this.apiUrl}/applications/${this.application.id}/documents/upload`,
      formData
    ).subscribe({
      next: (updatedApplication) => {
        this.application = updatedApplication;
        this.selectedFile = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to upload document';
        this.isLoading = false;
      }
    });
  }

  downloadDocument(document: UploadedDocuments): void {
    window.open(document.url, '_blank');
  }
}