import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-profile.component',

  templateUrl: './edit-profile.component.component.html',
  styleUrl: './edit-profile.component.component.css',
    imports: [
    CommonModule,
    FormsModule,

   
]
,
})
export class EditProfileComponentComponent implements OnInit {
  driver: any = {};
  isLoading = false;
  selectedFile: File | null = null;
  selectedDocumentType = '';
  selectedDocumentPurpose = '';
  documents: any[] = [];
  documentTypes: string[] = [];
  documentPurposes: string[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const driverId = this.route.snapshot.paramMap.get('id');
    if (driverId) {
      this.fetchDriver(driverId);
      this.fetchDriverDocuments(driverId);
    }
    this.loadDocumentEnums();
  }

  fetchDriver(id: string): void {
    this.isLoading = true;
    this.http.get<any>(`http://41.76.110.219:8181/profile/drivers/${id}`)
      .subscribe({
        next: (response) => {
          this.driver = response.data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching driver:', error);
          this.isLoading = false;
        }
      });
  }

  fetchDriverDocuments(driverId: string): void {
    this.http.get<any>(`http://41.76.110.219:8181/api/v1/files?userName=${this.driver.userName}`)
      .subscribe({
        next: (response) => {
          this.documents = response.data;
        },
        error: (error) => {
          console.error('Error fetching documents:', error);
        }
      });
  }

  loadDocumentEnums(): void {
    // These would ideally come from an API endpoint
    this.documentTypes = [
      'IDENTITY', 'PASSPORT', 'DRIVER_LICENSE', 
      'LICENSE_DISC', 'CAR_REGISTRATION', 
      'INSURANCE', 'CRIMINAL_REPORT'
    ];
    
    this.documentPurposes = [
      'PROFILE_PICTURE', 'ID_DOCUMENT', 
      'PROOF_OF_ADDRESS', 'LICENSE',
      'VEHICLE_REGISTRATION', 'VEHICLE_INSURANCE'
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
    if (!file || !this.driver.userName) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    this.http.post<any>(
      `http://41.76.110.219:8181/api/v1/files?userName=${this.driver.userName}&fileType=IMAGE&documentPurpose=PROFILE_PICTURE`,
      formData
    ).subscribe({
      next: (response) => {
        this.driver.profilePictureUrl = response.data.downloadUrl;
      },
      error: (error) => {
        console.error('Error uploading profile picture:', error);
      }
    });
  }

  uploadDocument(): void {
    if (!this.selectedFile || !this.selectedDocumentType || !this.selectedDocumentPurpose || !this.driver.userName) {
      alert('Please select a file, document type, and purpose');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    
    this.http.post<any>(
      `http://41.76.110.219:8181/api/v1/files?userName=${this.driver.userName}&fileType=${this.selectedDocumentType}&documentPurpose=${this.selectedDocumentPurpose}`,
      formData
    ).subscribe({
      next: (response) => {
        this.documents.push(response.data);
        this.selectedFile = null;
      },
      error: (error) => {
        console.error('Error uploading document:', error);
      }
    });
  }

  viewDocument(documentId: number): void {
    window.open(`http://41.76.110.219:8181/api/v1/files/stream?id=${documentId}`, '_blank');
  }

  updateDriver(): void {
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
}}
