import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { ApplicationDto, } from '../../model/application.dto';
import { ApplicationStatus } from '../../services/application-status';
import { Role, ROLE_CONFIGS } from '../../services/role.enum';
import { environment } from '../../environments/environment';
import { DocumentPurpose } from '../../services/document-purpose';
type AppTab = 'overview' | 'new' | 'details';
enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PDF = 'PDF',
  WORD = 'WORD',
  EXCEL = 'EXCEL',
  PPT = 'PPT',
  TEXT = 'TEXT',
  ZIP = 'ZIP',
  CSV = 'CSV',
  JSON = 'JSON',
  XML = 'XML',
  HTML = 'HTML',
  OTHER = 'OTHER'
}

@Component({
  selector: 'application-dashboard',
  templateUrl: './application-dashboard.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./application-dashboard.component.css'],
  standalone: true
})
export class ApplicationDashboardComponent implements OnInit {
getImagePreview(arg0: File) {
throw new Error('Method not implemented.');
}
  applications: ApplicationDto[] = [];
  selectedApplication: ApplicationDto | null = null;
  isLoading = false;
  selectedFile: File | null = null;
  documentPurpose: DocumentPurpose | null = null;
  searchQuery: string = '';
  searchResults: ApplicationDto[] = [];
  searchPerformed: boolean = false;
  errorMessage: string = '';
  missingDocuments: string[] = [];
   activeTab: AppTab = 'overview';
  
  availableApplicationRoles: Role[] = [
    Role.DRIVER, 
    Role.FLEET_OWNER, 
    Role.AGENCY, 
    Role.ADVERTISER,
  ];

  // Enums and configs for template
  Role = Role;
  ApplicationStatus = ApplicationStatus;
  ROLE_CONFIGS = ROLE_CONFIGS;
  documentPurposes = Object.values(DocumentPurpose);
  DocumentPurpose = DocumentPurpose;
  
  vehicleTypes = [
    'Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Bus', 
    'Taxi', 'Delivery Van', 'Heavy Duty Truck', 'Trailer'
  ];

  licenseTypes = [
    'Learner', 'Code 8', 'Code 10', 'Code 14', 
    'Professional Driving Permit', 'International'
  ];

  companyTypes = [
    'Pty Ltd', 'Sole Proprietor', 'Partnership', 
    'CC', 'Non-Profit', 'Government'
  ];

  submissionForm = {
    applicationRole: null as Role | null,
    profileImage: null as File | null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    gender: '',
    idNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    licenseType: '',
    yearsOfExperience: 0,
    companyName: '',
    companyRegistrationNumber: '',
    taxNumber: '',
    companyType: '',
    vatRegistered: false,
    website: '',
    contactPerson: '',
    contactTitle: '',
    fleetSize: 0,
    vehicles: [] as Array<{
      vehicleType: string;
      licensePlate: string;
      capacity: string;
      color: string;
      year: string;
      vehicleImage: File | null;
    }>,
    documents: [] as { type: DocumentPurpose; file: File }[],
    submissionDate: '' as string,
    approvalDate: '' as string
  };

  constructor(
    private http: HttpClient,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.submissionForm.vehicles.push(this.createEmptyVehicle());
  }

  createEmptyVehicle() {
    return {
      vehicleType: '',
      licensePlate: '',
      capacity: '',
      color: '',
      year: '',
      vehicleImage: null
    };
  }


 
  showTab(tab: AppTab): boolean {
    const conditions: Record<AppTab, boolean> = {
      overview: true,
      new: true,
      details: !!this.selectedApplication
    };
    return conditions[tab];
  }

  // Tab activation
  setActiveTab(tab: AppTab): void {
    this.activeTab = tab;
  }

  // Current tab check (for content display)
  isActiveTab(tab: AppTab): boolean {
    return this.activeTab === tab;
  }
  // Returns CSS classes based on active state
  getTabClasses(tab: AppTab): string {
    const baseClasses = 'border-b-2 font-medium text-sm py-4 px-1';
    return this.activeTab === tab
      ? `${baseClasses} border-indigo-500 text-indigo-600 dark:text-indigo-400`
      : `${baseClasses} border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300`;
  }

  addVehicle() {
    this.submissionForm.vehicles.push(this.createEmptyVehicle());
  }

  removeVehicle(index: number) {
    if (this.submissionForm.vehicles.length > 1) {
      this.submissionForm.vehicles.splice(index, 1);
    }
  }

  onVehicleImageSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.submissionForm.vehicles[index].vehicleImage = input.files[0];
    }
  }

  onProfileImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.submissionForm.profileImage = input.files[0];
    }
  }

  selectApplicationRole(role: Role): void {
    this.submissionForm.applicationRole = role;
    if (role !== Role.DRIVER && role !== Role.FLEET_OWNER) {
      this.submissionForm.vehicles = [];
    } else if (this.submissionForm.vehicles.length === 0) {
      this.submissionForm.vehicles.push(this.createEmptyVehicle());
    }
  }

  getRequiredDocuments(): { name: string; description: string; type: DocumentPurpose }[] {
    if (!this.submissionForm.applicationRole) return [];

    const baseDocuments = [
      {
        name: 'ID Document',
        description: 'Clear copy of your ID or passport (front and back)',
        type: DocumentPurpose.ID_DOCUMENT
      },
      {
        name: 'Proof of Address',
        description: 'Recent utility bill or bank statement (not older than 3 months)',
        type: DocumentPurpose.PROOF_OF_ADDRESS
      },
      {
        name: 'Profile Picture',
        description: 'Clear passport-style photo',
        type: DocumentPurpose.PROFILE_PICTURE
      }
    ];

    switch (this.submissionForm.applicationRole) {
      case Role.DRIVER:
        return [
          ...baseDocuments,
          {
            name: 'Driver License',
            description: 'Valid driver license (all pages)',
            type: DocumentPurpose.LICENSE
          },
          {
            name: 'Professional Driving Permit',
            description: 'If applicable',
            type: DocumentPurpose.VEHICLE_INSPECTION_REPORT
          },
          {
            name: 'Vehicle Registration',
            description: 'For each vehicle you operate',
            type: DocumentPurpose.VEHICLE_REGISTRATION
          }
        ];
      case Role.FLEET_OWNER:
        return [
          ...baseDocuments,
          {
            name: 'Company Registration',
            description: 'CIPC registration documents',
            type: DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE
          },
          {
            name: 'Tax Clearance',
            description: 'SARS tax clearance certificate',
            type: DocumentPurpose.TAX_CLEARANCE_CERTIFICATE
          },
          {
            name: 'Business License',
            description: 'Valid business operating license',
            type: DocumentPurpose.BUSINESS_LICENSE
          },
          {
            name: 'Vehicle Registrations',
            description: 'For each vehicle in your fleet',
            type: DocumentPurpose.VEHICLE_REGISTRATION
          }
        ];
      case Role.AGENCY:
        return [
          ...baseDocuments,
          {
            name: 'Company Registration',
            description: 'CIPC registration documents',
            type: DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE
          },
          {
            name: 'Tax Clearance',
            description: 'SARS tax clearance certificate',
            type: DocumentPurpose.TAX_CLEARANCE_CERTIFICATE
          },
          {
            name: 'Agency License',
            description: 'Valid agency operating license',
            type: DocumentPurpose.BUSINESS_LICENSE
          }
        ];
      case Role.ADVERTISER:
        return [
          ...baseDocuments,
          {
            name: 'Company Registration',
            description: 'Proof of company registration',
            type: DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE
          }
        ];
      default:
        return baseDocuments;
    }
  }

  validateDocuments(): boolean {
    this.missingDocuments = [];
    if (!this.submissionForm.applicationRole) return false;
    
    const requiredDocs = this.getRequiredDocuments().map(d => d.type);
    const uploadedDocs = this.submissionForm.documents.map(d => d.type);
    
    if (requiredDocs.includes(DocumentPurpose.PROFILE_PICTURE) && !this.submissionForm.profileImage) {
      this.missingDocuments.push('Profile Picture');
    }

    if ((this.submissionForm.applicationRole === Role.DRIVER || 
         this.submissionForm.applicationRole === Role.FLEET_OWNER) &&
        this.submissionForm.vehicles.length === 0) {
      this.missingDocuments.push('At least one vehicle must be added');
    }

    this.submissionForm.vehicles.forEach((vehicle, index) => {
      if (!vehicle.vehicleImage) {
        this.missingDocuments.push(`Vehicle ${index + 1} image`);
      }
    });

    requiredDocs.forEach(docType => {
      if (docType !== DocumentPurpose.PROFILE_PICTURE && 
          !uploadedDocs.includes(docType)) {
        const docName = this.getRequiredDocuments().find(d => d.type === docType)?.name || docType;
        this.missingDocuments.push(docName);
      }
    });

    return this.missingDocuments.length === 0;
  }

  searchApplications() {
    if (!this.searchQuery) {
      this.errorMessage = 'Please enter an email address to search';
      return;
    }

    if (!this.isValidEmail(this.searchQuery)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const encodedEmail = encodeURIComponent(this.searchQuery.trim().toLowerCase());

    this.http.get<ApplicationDto[]>(`http://localhost:8443/api/applications/application-by-email?email=jane.doe%40example.com`).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.searchPerformed = true;
        this.searchResults = response || [];
        
        if (this.searchResults.length === 1) {
          this.selectedApplication = this.searchResults[0];
          this.activeTab = 'details';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.searchPerformed = true;
        this.searchResults = [];
        this.errorMessage = error.status === 404 
          ? 'No application found for this email.' 
          : 'Failed to search application. Please try again.';
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onDocumentSelected(event: Event, docType: DocumentPurpose): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.submissionForm.documents = this.submissionForm.documents.filter(d => d.type !== docType);
      this.submissionForm.documents.push({
        type: docType,
        file: input.files[0]
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  async submitApplication(): Promise<void> {
    if (!this.submissionForm.applicationRole) return;

    this.missingDocuments = [];
    if (!this.validateDocuments()) {
      this.errorMessage = `Missing required items: ${this.missingDocuments.join(', ')}`;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.submissionForm.submissionDate = new Date().toISOString();
    
    try {
      const formData = new FormData();
      
      Object.keys(this.submissionForm).forEach(key => {
        if (key === 'vehicles' || key === 'documents' || key === 'profileImage') return;
        const value = (this.submissionForm as any)[key];
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (this.submissionForm.profileImage) {
        formData.append('profileImage', this.submissionForm.profileImage);
      }

      if (this.submissionForm.vehicles.length > 0) {
        const vehiclesData = this.submissionForm.vehicles.map(v => ({
          vehicleType: v.vehicleType,
          licensePlate: v.licensePlate,
          capacity: v.capacity,
          color: v.color,
          year: v.year
        }));
        formData.append('vehicles', JSON.stringify(vehiclesData));
        
        this.submissionForm.vehicles.forEach((vehicle, index) => {
          if (vehicle.vehicleImage) {
            formData.append(`vehicleImage_${index}`, vehicle.vehicleImage);
          }
        });
      }

      const newApp = await this.http.post<ApplicationDto>(
        `${environment.api}/applications`, 
        formData
      ).toPromise();

      if (!newApp) throw new Error('Failed to create application');

      if (this.submissionForm.documents.length > 0) {
        await this.uploadAllDocuments(newApp.id);
      }

      this.applications = [...this.applications, newApp];
      this.activeTab = 'overview';
      this.resetForm();
    } catch (error) {
      console.error('Error submitting application:', error);
      this.errorMessage = 'Failed to submit application. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private async uploadAllDocuments(applicationId: number): Promise<void> {
    for (const doc of this.submissionForm.documents) {
      const formData = new FormData();
      formData.append('file', doc.file);
      formData.append('documentPurpose', doc.type);
      formData.append('fileType', this.getFileType(doc.file));

      try {
        await this.http.post(
          `${environment.api}/applications/${applicationId}/documents/upload`, 
          formData
        ).toPromise();
      } catch (error) {
        console.error(`Failed to upload document ${doc.type}:`, error);
      }
    }
  }

  private getFileType(file: File): FileType {
    const type = file.type.split('/')[0];
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (type) {
      case 'image': return FileType.IMAGE;
      case 'video': return FileType.VIDEO;
      case 'audio': return FileType.AUDIO;
      default:
        switch (extension) {
          case 'pdf': return FileType.PDF;
          case 'doc':
          case 'docx': return FileType.WORD;
          case 'xls':
          case 'xlsx': return FileType.EXCEL;
          case 'ppt':
          case 'pptx': return FileType.PPT;
          case 'txt': return FileType.TEXT;
          case 'zip': return FileType.ZIP;
          case 'csv': return FileType.CSV;
          case 'json': return FileType.JSON;
          case 'xml': return FileType.XML;
          case 'html': return FileType.HTML;
          default: return FileType.OTHER;
        }
    }
  }

  uploadDocument(): void {
    if (!this.selectedFile || !this.documentPurpose || !this.selectedApplication) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('documentPurpose', this.documentPurpose);
    formData.append('fileType', this.getFileType(this.selectedFile));

    this.http.post(`${environment.api}/applications/${this.selectedApplication.id}/documents/upload`, formData)
      .subscribe({
        next: () => {
          this.selectedFile = null;
          this.documentPurpose = null;
        },
        error: (error) => console.error('Error uploading document:', error)
      });
  }

  deleteDocument(documentId: number): void {
    if (!this.selectedApplication) return;
    
    if (confirm('Are you sure you want to delete this document?')) {
      this.http.delete(`${environment.api}/applications/${this.selectedApplication.id}/documents/${documentId}`)
        .subscribe({
          error: (error) => console.error('Error deleting document:', error)
        });
    }
  }

  handleApplicationDecision(action: 'approve' | 'reject'): void {
    if (!this.selectedApplication) return;

    const endpoint = action === 'approve' 
      ? `${environment.api}/applications/${this.selectedApplication.id}/approve`
      : `${environment.api}/applications/${this.selectedApplication.id}/reject`;

    const body = action === 'reject' 
      ? { rejectionReason: prompt('Please enter rejection reason:') || 'No reason provided' }
      : {};

    this.http.post(endpoint, body).subscribe({
      next: () => {
        if (this.selectedApplication) {
          this.selectedApplication.applicationStatus = action === 'approve' 
            ? ApplicationStatus.APPROVED 
            : ApplicationStatus.REJECTED;
        }
      },
      error: (error) => console.error(`Error ${action}ing application:`, error)
    });
  }

  isDocumentUploaded(docType: DocumentPurpose): boolean {
    return this.submissionForm.documents.some(d => d.type === docType);
  }

  getUploadedDocument(docType: DocumentPurpose): { type: DocumentPurpose; file: File } | undefined {
    return this.submissionForm.documents.find(d => d.type === docType);
  }

  removeDocument(docType: DocumentPurpose): void {
    this.submissionForm.documents = this.submissionForm.documents.filter(d => d.type !== docType);
  }

  getAcceptTypes(docType: DocumentPurpose): string {
    switch(docType) {
      case DocumentPurpose.PROFILE_PICTURE:
      case DocumentPurpose.VEHICLE_PHOTO:
        return 'image/*';
      case DocumentPurpose.ID_DOCUMENT:
      case DocumentPurpose.PROOF_OF_ADDRESS:
        return 'image/*,.pdf';
      case DocumentPurpose.LICENSE:
        return 'image/*,.pdf,.doc,.docx';
      default:
        return '*';
    }
  }

  canSubmitApplication(): boolean {
    if (!this.submissionForm.applicationRole) return false;
    return this.validateDocuments();
  }

  getProgressSteps(application: ApplicationDto): any[] {
    const status = application.applicationStatus || ApplicationStatus.PENDING;
    
    return [
      {
        id: 1,
        name: 'Submitted',
        status: status !== ApplicationStatus.PENDING ? 'complete' : 'current'
      },
      {
        id: 2,
        name: 'Under Review',
        status: status === ApplicationStatus.PENDING ? 'upcoming' : 
               status === ApplicationStatus.APPROVED || status === ApplicationStatus.REJECTED ? 'complete' : 'current'
      },
      {
        id: 3,
        name: status === ApplicationStatus.APPROVED ? 'Approved' : 
              status === ApplicationStatus.REJECTED ? 'Rejected' : 'Decision',
        status: status === ApplicationStatus.PENDING ? 'upcoming' : 'current'
      }
    ];
  }

  resetForm(): void {
    this.submissionForm = {
      applicationRole: null,
      profileImage: null,
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      gender: '',
      idNumber: '',
      dateOfBirth: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      licenseType: '',
      yearsOfExperience: 0,
      companyName: '',
      companyRegistrationNumber: '',
      taxNumber: '',
      companyType: '',
      vatRegistered: false,
      website: '',
      contactPerson: '',
      contactTitle: '',
      fleetSize: 0,
      vehicles: [this.createEmptyVehicle()],
      documents: [],
      submissionDate: '',
      approvalDate: ''
    };
    this.errorMessage = '';
    this.missingDocuments = [];
  }

  getStatusText(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.PENDING: return 'Pending Review';
      case ApplicationStatus.APPROVED: return 'Approved';
      case ApplicationStatus.REJECTED: return 'Rejected';
      case ApplicationStatus.MORE_INFO_REQUIRED: return 'More Info Needed';
      default: return 'Unknown Status';
    }
  }

  getStatusColor(status: ApplicationStatus): string {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case ApplicationStatus.APPROVED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case ApplicationStatus.MORE_INFO_REQUIRED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getRoleLabel(role: Role | undefined): string {
    return role ? ROLE_CONFIGS[role]?.label || 'N/A' : 'N/A';
  }
}