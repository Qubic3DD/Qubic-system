import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.component.html',
  styleUrl: './edit-profile.component.component.css',
})
export class EditProfileComponentComponent implements OnInit {
  driver: any = {
    vehicleInformation: [],
    languages: [],
    uploadedDocuments: []
  };
  isLoading = false;
  selectedFile: File | null = null;
  selectedDocumentType = '';
  selectedDocumentPurpose = '';
  documentTypes: string[] = [];
  documentPurposes: string[] = [];
  languagesInput = '';
  currentStep = 1;
  totalSteps = 5;
  userDocuments: any[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.fetchDriverProfile(email);
    }
    this.loadDocumentEnums();
  }

  fetchDriverProfile(email: string): void {
    this.isLoading = true;
    this.http.get<any>(`http://41.76.110.219:8181/profile/retrieve/${email}`)
      .subscribe({
        next: (response) => {
          this.driver = response.data;
          
          if (!this.driver.vehicleInformation) {
            this.driver.vehicleInformation = [];
          }
          if (!this.driver.languages) {
            this.driver.languages = [];
          }
          if (!this.driver.uploadedDocuments) {
            this.driver.uploadedDocuments = [];
          }
          
          this.languagesInput = this.driver.languages.join(', ');
          
          if (this.driver.dateOfBirth) {
            this.driver.dateOfBirth = this.formatDateForInput(this.driver.dateOfBirth);
          }
          
          this.loadUserDocuments();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching driver profile:', error);
          this.isLoading = false;
        }
      });
  }

  loadUserDocuments(): void {
    if (!this.driver.username) return;
    
    this.http.get<any>(`http://41.76.110.219:8181/api/v1/files/list?username=${this.driver.username}`)
      .subscribe({
        next: (response) => {
          this.userDocuments = response.data || [];
        },
        error: (error) => {
          console.error('Error loading user documents:', error);
        }
      });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  loadDocumentEnums(): void {
    this.documentTypes = [
      'IDENTITY',
      'PASSPORT',
      'DRIVER_LICENSE',
      'LICENSE_DISC',
      'CAR_REGISTRATION',
      'BOLT_REGISTRATION',
      'UBER_REGISTRATION',
      'IN_DRIVER_REGISTRATION',
      'INSURANCE',
      'CRIMINAL_REPORT',
      'DRIVING_HISTORY_REPORT',
      'BUSINESS_REGISTRATION',
      'TAX_REGISTRATION',
      'MAINTENANCE_RECORDS',
      'PROFILE_PICTURE',
      'PROFILE_VIDEO',
      'CAMPAIGN_PICTURE',
      'CAMPAIGN_VIDEO',
      'OTHER_IMAGE',
      'OTHER_VIDEO',
      'OTHER_DOCUMENT'
    ];

    this.documentPurposes = [
      'PROFILE_PICTURE',
      'ID_DOCUMENT',
      'PROOF_OF_ADDRESS',
      'LICENSE',
      'VEHICLE_REGISTRATION',
      'VEHICLE_INSURANCE',
      'VEHICLE_INSPECTION_REPORT',
      'VEHICLE_PHOTO',
      'ROADWORTHY_CERTIFICATE',
      'BUSINESS_REGISTRATION_CERTIFICATE',
      'BUSINESS_LICENSE',
      'TAX_CLEARANCE_CERTIFICATE',
      'COMPANY_PROFILE',
      'COMPANY_LOGO',
      'BUSINESS_ADDRESS_PROOF',
      'CAMPAIGN_VIDEO',
      'CAMPAIGN_PICTURE',
      'OTHER'
    ];
  }

  onFileSelected(event: any, isProfilePicture: boolean = false): void {
    const file: File = event.target.files[0];
    if (isProfilePicture) {
      this.uploadProfilePicture(file);
    } else {
      this.selectedFile = file;
    }
  }

  uploadProfilePicture(file: File): void {
    if (!file || !this.driver.username) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    this.http.post<any>(
      `http://41.76.110.219:8181/api/v1/files?userName=${this.driver.username}&fileType=IMAGE&documentPurpose=PROFILE_PICTURE`,
      formData
    ).subscribe({
      next: (response) => {
        this.driver.profilePictureUrl = response.data.downloadUrl;
        this.loadUserDocuments(); // Refresh documents list
      },
      error: (error) => {
        console.error('Error uploading profile picture:', error);
      }
    });
  }

  uploadDocument(): void {
    if (!this.selectedFile || !this.selectedDocumentType || !this.selectedDocumentPurpose || !this.driver.username) {
      alert('Please select a file, document type, and purpose');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    
    this.http.post<any>(
      `http://41.76.110.219:8181/api/v1/files?userName=${this.driver.username}&fileType=${this.selectedDocumentType}&documentPurpose=${this.selectedDocumentPurpose}`,
      formData
    ).subscribe({
      next: (response) => {
        this.loadUserDocuments(); // Refresh documents list
        this.selectedFile = null;
        this.selectedDocumentType = '';
        this.selectedDocumentPurpose = '';
      },
      error: (error) => {
        console.error('Error uploading document:', error);
      }
    });
  }

  viewDocument(documentId: number): void {
    window.open(`http://41.76.110.219:8181/api/v1/files/stream?id=${documentId}`, '_blank');
  }

  checkDocumentExists(purpose: string): boolean {
    return this.userDocuments.some(doc => doc.documentPurpose === purpose);
  }

  getDocumentUrl(purpose: string): string {
    const doc = this.userDocuments.find(d => d.documentPurpose === purpose);
    return doc ? `http://41.76.110.219:8181/api/v1/files/stream?id=${doc.id}` : '';
  }

  addVehicle(): void {
    this.driver.vehicleInformation.push({
      capacity: '',
      colour: '',
      licenseRegistrationNo: '',
      transportType: '',
      vehicleType: ''
    });
  }

  removeVehicle(index: number): void {
    this.driver.vehicleInformation.splice(index, 1);
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  updateDriver(): void {
    if (this.languagesInput) {
      this.driver.languages = this.languagesInput.split(',').map(lang => lang.trim()).filter(lang => lang);
    } else {
      this.driver.languages = [];
    }

    this.isLoading = true;
    this.http.put<any>(`http://41.76.110.219:8181/profile/edit`, this.driver)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/drivers']);
        },
        error: (error) => {
          console.error('Error updating driver:', error);
          this.isLoading = false;
        }
      });
  }

  cancelEdit(): void {
    this.router.navigate(['/drivers']);
  }
}