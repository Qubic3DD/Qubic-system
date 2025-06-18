import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApplicationDocument, ApplicationDto } from '../../model/application.dto';
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
  ],
  standalone: true
})
export class ApplicationDashboardComponent implements OnInit {
  application: ApplicationDto | null = null;
  isLoading = true;
  errorMessage = '';
  selectedFile: File | null = null;
  selectedDocumentType: DocumentPurpose = DocumentPurpose.ID_DOCUMENT;
  documentPurposes = Object.values(DocumentPurpose);
  apiUrl = environment.api;
  email!: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.email = email;
      this.fetchApplication(email);
    } else {
      this.errorMessage = 'No email provided';
      this.isLoading = false;
    }
  }

  fetchApplication(email: string): void {
    if (email) {
      this.errorMessage = 'Please enter an email address';
      return;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const encodedEmail = encodeURIComponent(email.trim().toLowerCase());
    const apiUrl = `${this.apiUrl}applications/by-email/${encodedEmail}`;

    this.http.get<ApplicationDto>(apiUrl).subscribe({
      next: (response: ApplicationDto) => {
        this.isLoading = false;
        this.application = response;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching application:', error);

        if (error.status === 404) {
          this.errorMessage = 'No application found for this email.';
        } else if (error.status === 500 && error.error?.errorDetails?.includes('No static resource')) {
          this.errorMessage = 'Server misconfiguration. Please check the backend routing.';
        } else {
          this.errorMessage = error.error?.message || 'Failed to fetch application. Please try again later.';
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  isValidEmail(email: string): boolean {
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
      `${this.apiUrl}applications/${this.application.id}/documents/upload`,
      formData
    ).subscribe({
      next: (updatedApplication) => {
        this.application = updatedApplication;
        this.selectedFile = null;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to upload document';
        this.isLoading = false;
      }
    });
  }

  downloadDocument(document: ApplicationDocument): void {
    if (document.url) {
      window.open(document.url, '_blank');
    }
  }
}