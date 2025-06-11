export interface ApiResponse<T> {
  token: string | null;
  data: T;
  message: string;
  timestamp: string;
}


export interface Application {
    id?: number;
  email?: string;
  profile?: string;
  IDNo?: string;
  phoneNo?: string;
  username?: string;
  userHandle?: string;
  roles?: string[];

  firstName?: string;
  lastName?: string;
  gender?: string;
  idNumber?: string;
  licenseType?: string;
  status?: string;
  dateOfBirth?: string;

  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  location?: string;

  serviceInformation?: string;
  companyName?: string;
  isCompany?: boolean;
  companyRegistrationNumber?: string;
  taxNumber?: string;
  companyType?: string;
  vatRegistered?: boolean;
  website?: string;
  fleetCount?: number;
  coverageAreas?: string[];
  servicesOffered?: string[];
  operatingHours?: string;

  contactPerson?: string;
  contactTitle?: string;
  supportContact?: string;

  disability?: string;
  bio?: string;
  languages?: string[];
  logo?: string;
  businessLicenseUrl?: string;
  socialLinks?: string;

  verified?: boolean;
  verificationDate?: string;
  documentsVerified?: boolean;

  rating?: number;
  reviewsCount?: number;
  fleetRating?: number;
  revenue?: number;
  completedJobs?: number;
  activeCampaigns?: number;
  activeContracts?: number;
  numberOfDrivers?: number;

  vehicleInformation?: VehicleInformationRequest[]; // define this separately if needed
  availableVehicleTypes?: string[];
  preferredOperatingAreas?: string[];

  subscriptionPlan?: string;
  subscriptionExpiry?: string;

  // Additional application workflow fields
  submissionDate?: string | Date;
  approvalDate?: string | Date;
  reviewed?: boolean;
  approved?: boolean;
  rejected?: boolean;
  rejectionReason?: string;
  documents?: UserDocuments[];

  type?: string;
}

export enum DocumentPurpose {
    PROFILE_PICTURE,
    ID_DOCUMENT,
    PROOF_OF_ADDRESS,
    LICENSE,
    VEHICLE_REGISTRATION,
    VEHICLE_INSURANCE,
    VEHICLE_INSPECTION_REPORT,
    VEHICLE_PHOTO,
    ROADWORTHY_CERTIFICATE,
    BUSINESS_REGISTRATION_CERTIFICATE,
    BUSINESS_LICENSE,
    TAX_CLEARANCE_CERTIFICATE,
    COMPANY_PROFILE,
    COMPANY_LOGO,
    BUSINESS_ADDRESS_PROOF,
    CAMPAIGN_VIDEO,
    CAMPAIGN_PICTURE,
    OTHER
}


export interface UserDocuments {
  id: number;
  name: string;
  fileType: string;
  documentPurpose: string;
  creationDate: string;
  downloadUrl?: string;
}


export interface VehicleInformationRequest {
  capacity: string;
  colour: string;
  licenseRegistrationNo: string;
  creationDate: string | null;
  transportType: string;
  vehicleType: string;
  userInformationId: number | null;
  public: boolean;
}