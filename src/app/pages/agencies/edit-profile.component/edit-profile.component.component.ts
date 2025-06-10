// edit-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse, DriverProfile, VehicleInfo, UserDocument } from '../../../api/Response/interfaces';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.component.html',
  styleUrl: './edit-profile.component.component.css',
})
export class EditAgenciesComponent implements OnInit {
  
 driver: DriverProfile = {
    accountId: 0,
    username: '',
    email: '',
    fullName: '',
    profile: '',
    phoneNo: '',
    roles: [],
    userHandle: '',
    creationDate: '',
    userInfoId: 0,
    firstName: '',
    lastName: '',
    gender: '',
    idNumber: '',
    licenseType: '',
    dateOfBirth: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    serviceInformation: '',
    companyName: '',
    website: '',
    disability: '',
    bio: '',
    rating: null,
    languages: [],
    vehicleInformation: [],
    uploadedDocuments: [],
    uploadedMediaFiles: [],
    idno: null,
    company: false
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
  userDocuments: UserDocument[] = [];
successPopupVisible = false;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.fetchDriverProfile(decodeURIComponent(email)); // Decode in case of URL-encoded email
      this.driver.email = decodeURIComponent(email);
    }
    this.loadDocumentEnums();
  }
showSuccessPopup() {
  this.successPopupVisible = true;
  setTimeout(() => {
    this.successPopupVisible = false;
  }, 3000); // Hide after 3 seconds
}
  fetchDriverProfile(email: string): void {
    this.isLoading = true;
    this.http.get<ApiResponse<DriverProfile>>(`http://41.76.110.219:8443/profile/retrieve/${email}`)
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.driver = {
              ...this.driver,
              ...response.data,
              dateOfBirth: this.formatDateForInput(response.data.dateOfBirth),
              languages: response.data.languages || [],
              vehicleInformation: response.data.vehicleInformation || []
            };
            this.languagesInput = this.driver.languages.join(', ');
              this.userDocuments = response.data.uploadedDocuments || [];
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
getDocumentPurposeLabel(purpose: string): string {
  const purposeMap: {[key: string]: string} = {
    'ID_DOCUMENT': 'ID Document',
    'LICENSE': 'Driver License',
    'PROOF_OF_ADDRESS': 'Proof of Address',
    'INSURANCE': 'Insurance',
    'VEHICLE_REGISTRATION': 'Vehicle Registration'
  };
  return purposeMap[purpose] || purpose;
}


viewDocument(username: string, documentPurpose: string): void {
  const url = `http://41.76.110.219:8443/api/v1/files/stream?username=${encodeURIComponent(username)}&documentPurpose=${documentPurpose}`;
  window.open(url, '_blank');
}

downloadDocument(username: string, documentPurpose: string): void {
  const url = `http://41.76.110.219:8443/api/v1/files/download?username=${encodeURIComponent(username)}&documentPurpose=${documentPurpose}`;
  console.log('Downloading document from:', url);
  window.open(url, '_blank');
}
//
  loadUserDocuments(): void {
    if (!this.driver.username) return;
    
    this.http.get<{data: UserDocument[]}>(`http://41.76.110.219:8443/api/v1/files/list?username=${this.driver.username}`)
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
    if (!dateString) return '';
    try {
      const datePart = dateString.split(' ')[0];
      return datePart;
    } catch (e) {
      console.warn('Could not parse date:', dateString);
      return '';
    }
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
// In your component.ts file
vehicleTypes = [
  { label: 'Hatchback', value: 'HATCH' },
  { label: 'Sedan', value: 'SEDAN' },
  { label: 'SUV', value: 'SUV' },
  { label: 'Taxi', value: 'TAXI' },
  { label: 'Bus', value: 'BUS' },
  { label: 'Mini Bus', value: 'MINI_BUS' },
];

transportTypes = [
  { label: 'Taxi', value: 'TAXI' },
  { label: 'Bus', value: 'BUS' },
  { label: 'Bolt', value: 'BOLT' },
  { label: 'Uber', value: 'UBER' },
  { label: 'InDrive', value: 'InDRIVE' },
  { label: 'Other', value: 'OTHER' },
];

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
    
    this.http.post<{data: {downloadUrl: string}}>(
      `http://41.76.110.219:8443/api/v1/files?userName=${this.driver.username}&fileType=IMAGE&documentPurpose=PROFILE_PICTURE`,
      formData
    ).subscribe({
      next: (response) => {
        // Update profile picture URL
        // You might need to update this based on your actual API response structure
        if (response.data?.downloadUrl) {
          // Assuming you have a profilePictureUrl field
          // If not, you might need to add it to your interface
          (this.driver as any).profilePictureUrl = response.data.downloadUrl;
        }
        this.loadUserDocuments();
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
      `http://41.76.110.219:8443/api/v1/files?userName=${this.driver.username}&fileType=${this.selectedDocumentType}&documentPurpose=${this.selectedDocumentPurpose}`,
      formData
    ).subscribe({
      next: () => {
        this.loadUserDocuments();
        this.selectedFile = null;
        this.selectedDocumentType = '';
        this.selectedDocumentPurpose = '';
      },
      error: (error) => {
        console.error('Error uploading document:', error);
      }
    });
  }



  checkDocumentExists(purpose: string): boolean {
    return this.userDocuments.some(doc => doc.documentPurpose === purpose);
  }
getDocumentUrlByUsernameAndPurpose(username: string, purpose: string): string {
  const encodedUsername = encodeURIComponent(username);
  const encodedPurpose = encodeURIComponent(purpose);
  return `http://41.76.110.219:8443/api/v1/files/stream?username=${encodedUsername}&documentPurpose=${encodedPurpose}`;
}

  getDocumentUrl(purpose: string): string {
    const doc = this.userDocuments.find(d => d.documentPurpose === purpose);
    return doc ? `http://41.76.110.219:8443/api/v1/files/stream?id=${doc.id}` : '';
  }

  addVehicle(): void {
    const newVehicle: VehicleInfo = {
      capacity: '',
      colour: '',
      licenseRegistrationNo: '',
      creationDate: null,
      transportType: '',
      vehicleType: '',
      userInformationId: null,
      public: true
    };
    this.driver.vehicleInformation.push(newVehicle);
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
  // Process languages input
  if (this.languagesInput) {
    this.driver.languages = this.languagesInput
      .split(',')
      .map(lang => lang.trim())
      .filter(lang => lang);
  } else {
    this.driver.languages = [];
  }

  // ✅ Convert dateOfBirth (string like '2000-06-04') to proper ISO string
  if (this.driver.dateOfBirth) {
    const parsedDate = new Date(this.driver.dateOfBirth);
    this.driver.dateOfBirth = parsedDate.toISOString(); // Sends '2000-06-04T00:00:00.000Z'
  }

  this.isLoading = true;
  this.http.post<ApiResponse<DriverProfile>>('http://41.76.110.219:8443/profile/edit', this.driver)
    .subscribe({
      next: (response) => {
        this.isLoading = false;
     if (response.message === 'Profile updated successfully') {
          this.showSuccessPopup(); // 👈 Show success bar
          setTimeout(() => this.router.navigate(['/agencies']), 3000); // navigate after delay
        } else {
          console.error('Update failed:', response.message);
        }
      },
      error: (error) => {
        console.error('Error updating driver:', error);
        this.isLoading = false;
      }
    });
}


  cancelEdit(): void {
    this.router.navigate(['/agencies']);
  }
}