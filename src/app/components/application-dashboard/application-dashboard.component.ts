import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { ApplicationDto } from '../../model/application.dto';
import { ApplicationStatus } from '../../services/application-status';
import { Role, ROLE_CONFIGS } from '../../services/role.enum';
import { environmentApplication } from '../../environments/environment';
import { DocumentPurpose } from '../../services/document-purpose';
import { TransportType } from '../../services/transport-type.enum';
import { VehicleType } from '../../services/vehicle-type.enum';

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
  
 
   vehicleTypes = Object.values(VehicleType).filter(value => typeof value === 'string') as string[];
transportTypes = Object.values(TransportType).filter(value => typeof value === 'string') as string[];

// Make enums available to template
VehicleType = VehicleType;
TransportType = TransportType;
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
      vehicles: [] as Array<{
    vehicleType: VehicleType;
    licensePlate: string;
    capacity: string;
    color: string;
    year: string;
    vehicleImage: File | null;
    transportType?: TransportType; // Optional if needed
  }>,
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
    vehicleType: '' as VehicleType | '', // Initialize with empty string but allow VehicleType
    licensePlate: '',
    capacity: '',
    color: '',
    year: '',
    vehicleImage: null,
    transportType: '' as TransportType | '' // Optional field for transport type
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

  setActiveTab(tab: AppTab): void {
    this.activeTab = tab;
  }

  isActiveTab(tab: AppTab): boolean {
    return this.activeTab === tab;
  }

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

    this.http.get<ApplicationDto[]>(`${environmentApplication.api}applications/application-by-email?email=${encodedEmail}`).subscribe({
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
    // Format date of birth to ISO string (YYYY-MM-DD)
const formattedDateOfBirth = this.formatDate(this.submissionForm.dateOfBirth);

const vehicles = this.submissionForm.vehicles.map(vehicle => ({
      ...vehicle,
      // Convert string enum values to proper enum types
      vehicleType: vehicle.vehicleType as VehicleType,
      transportType: vehicle.transportType as TransportType
    }));

    // Determine roles based on application role
    const roles = this.getRolesForApplication(this.submissionForm.applicationRole);

    // 1. First submit only the basic application data without any files
    const applicationData = {
      ...this.submissionForm,
      dateOfBirth: formattedDateOfBirth, // Use formatted date
       vehicles: vehicles,
      roles: roles,
      // Remove all file-related fields
      profileImage: undefined,
     
      documents: undefined
    };

    // Submit the application
    const newApp = await this.http.post<ApplicationDto>(
      `${environmentApplication.api}applications`, 
      applicationData,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    ).toPromise();

    if (!newApp) throw new Error('Failed to create application');

    // 2. Upload all documents separately
    await this.uploadAllDocumentss(newApp.id);

    // 3. Fetch the complete application
    const completeApp = await this.http.get<ApplicationDto>(
      `${environmentApplication.api}application-by-email?email=${newApp.email}`
    ).toPromise();

    if (completeApp) {
      this.applications = [...this.applications, completeApp];
      this.selectedApplication = completeApp;
      this.activeTab = 'details';
    }

    this.errorMessage = 'Application submitted successfully!';
    setTimeout(() => {
      this.resetForm();
      this.errorMessage = '';
    }, 3000);

  } catch (error) {
    console.error('Error submitting application:', error);
    this.errorMessage = 'Failed to submit application. Please try again.';
  } finally {
    this.isLoading = false;
  }
}
private formatDate(dateString: string): string {
  if (!dateString) return '';

  try {
    // If already in correct format (ISO with 'T'), return as-is
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/.test(dateString)) {
      return dateString;
    }

    // Parse the date and format it with 'T' separator
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format');
    }

    // Format as ISO-8601 (Java-compatible)
    const isoString = date.toISOString(); // "2025-06-30T02:00:00.000Z"
    return isoString.replace('Z', ''); // Remove 'Z' if timezone is not needed
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
}
private getRolesForApplication(applicationRole: Role): string[] {
  switch(applicationRole) {
    case Role.DRIVER:
      return ['DRIVER'];
    case Role.FLEET_OWNER:
      return ['FLEET_OWNER'];
    case Role.AGENCY:
      return ['AGENCY'];
    case Role.ADVERTISER:
      return ['ADVERTISER'];
    default:
      return ['PASSENGER'];
  }
}

private async uploadAllDocumentss(applicationId: number): Promise<void> {
  // 1. Upload profile image if exists
  if (this.submissionForm.profileImage) {
    await this.uploadDocuments(
      applicationId,
      this.submissionForm.profileImage,
      DocumentPurpose.PROFILE_PICTURE
    );
  }
  // Upload vehicle images and information
  for (const [index, vehicle] of this.submissionForm.vehicles.entries()) {
    // First upload vehicle data
    const vehicleRequest: VehicleInformationRequest = {
      capacity: vehicle.capacity,
      colour: vehicle.color,
      licenseRegistrationNo: vehicle.licensePlate,
      isPublic: true, // or your logic
      creationDate: new Date(),
      transportType: vehicle.transportType as TransportType,
      vehicleType: vehicle.vehicleType as VehicleType,
      userInformationId: applicationId
    };

    const vehicleResponse = await this.http.post(
      `${environmentApplication.api}vehicles`,
      vehicleRequest
    ).toPromise();

    // Then upload vehicle image if exists
    if (vehicle.vehicleImage) {
      await this.uploadDocuments(
        applicationId,
        vehicle.vehicleImage,
        DocumentPurpose.VEHICLE_PHOTO,
        {
          vehicleId: vehicleResponse.id, // Assuming backend returns vehicle ID
          licensePlate: vehicle.licensePlate
        }
      );
    }
  }

  // 3. Upload other documents
  const uploadPromises = this.submissionForm.documents.map(doc => 
    this.uploadDocuments(applicationId, doc.file, doc.type)
  );

  await Promise.all(uploadPromises);
}

private async uploadDocuments(
  applicationId: number,
  file: File,
  purpose: DocumentPurpose,
  additionalData?: Record<string, string>
): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentPurpose', purpose);
  formData.append('fileType', this.getFileType(file));

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  try {
    await this.http.post(
      `${environmentApplication.api}applications/${applicationId}/documents/upload`, 
      formData
    ).toPromise();
  } catch (error) {
    console.error(`Error uploading ${purpose} document:`, error);
    // Continue even if some documents fail to upload
  }
}

  getDocumentIcon(docPurpose: DocumentPurpose): string {
    const icons: Record<DocumentPurpose, string> = {
      // Personal Documents
      [DocumentPurpose.PROFILE_PICTURE]: '🖼️',
      [DocumentPurpose.ID_DOCUMENT]: '🆔',
      [DocumentPurpose.PROOF_OF_ADDRESS]: '🏠',
      [DocumentPurpose.LICENSE]: '📜',

      // Vehicle-related Documents
      [DocumentPurpose.VEHICLE_REGISTRATION]: '🚗',
      [DocumentPurpose.VEHICLE_INSURANCE]: '🛡️',
      [DocumentPurpose.VEHICLE_INSPECTION_REPORT]: '🔍',
      [DocumentPurpose.VEHICLE_PHOTO]: '📷',
      [DocumentPurpose.ROADWORTHY_CERTIFICATE]: '✅',

      // Business-related Documents
      [DocumentPurpose.BUSINESS_REGISTRATION_CERTIFICATE]: '🏢',
      [DocumentPurpose.BUSINESS_LICENSE]: '📋',
      [DocumentPurpose.TAX_CLEARANCE_CERTIFICATE]: '💰',
      [DocumentPurpose.COMPANY_PROFILE]: '🏛️',
      [DocumentPurpose.COMPANY_LOGO]: '🔷',
      [DocumentPurpose.BUSINESS_ADDRESS_PROOF]: '🏢📍',

      // Campaign-related Media
      [DocumentPurpose.CAMPAIGN_VIDEO]: '🎥',
      [DocumentPurpose.CAMPAIGN_PICTURE]: '📸',

      // Miscellaneous
      [DocumentPurpose.OTHER]: '📄'
    };

    return icons[docPurpose] || '📄';
  }

  getDocumentName(docPurpose: DocumentPurpose): string {
    return docPurpose.toString().split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }

  isImageDocument(purpose: DocumentPurpose): boolean {
    return [
      DocumentPurpose.PROFILE_PICTURE,
      DocumentPurpose.ID_DOCUMENT,
      DocumentPurpose.VEHICLE_PHOTO,
      DocumentPurpose.COMPANY_LOGO
    ].includes(purpose);
  }

  getDocumentUrl(doc: any): string {
    if (this.isImageDocument(doc.purpose)) {
      return `${environmentApplication.api}applications/${doc.id}/documents/view?purpose=${doc.purpose}`;
    } else {
      return `${environmentApplication.api}applications/${doc.id}/documents/download?purpose=${doc.purpose}`;
    }
  }

  private async uploadAllDocument(applicationId: number): Promise<void> {
    const uploadPromises = this.submissionForm.documents.map(doc => {
      const formData = new FormData();
      formData.append('file', doc.file);
      formData.append('documentPurpose', doc.type);
      formData.append('fileType', this.getFileType(doc.file));

      return this.http.post(
        `${environmentApplication.api}/applications/${applicationId}/documents/upload`, 
        formData
      ).toPromise();
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading documents:', error);
      // Continue even if some documents fail to upload
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

    this.http.post(`${environmentApplication.api}applications/${this.selectedApplication.id}/documents/upload`, formData)
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
      this.http.delete(`${environmentApplication.api}applications/${this.selectedApplication.id}/documents/${documentId}`)
        .subscribe({
          error: (error) => console.error('Error deleting document:', error)
        });
    }
  }

  handleApplicationDecision(action: 'approve' | 'reject'): void {
    if (!this.selectedApplication) return;

    const endpoint = action === 'approve' 
      ? `${environmentApplication.api}applications/${this.selectedApplication.id}/approve`
      : `${environmentApplication.api}applications/${this.selectedApplication.id}/reject`;

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

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }
}