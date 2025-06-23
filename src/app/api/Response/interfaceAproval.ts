import { UploadedDocuments } from "../../model/application.dto";
import { Role } from "../../services/role.enum";
import { TransportType } from "../../services/transport-type.enum";
import { VehicleType } from "../../services/vehicle-type.enum";

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
  roles?: Role[];

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

  VehicleInformationrmation?: VehicleInformationrmationRequest[]; // define this separately if needed
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
  uploadedDocuments?: UploadedDocuments[];

  type?: string;
}

export enum DocumentPurpose {
  PROFILE_PICTURE = 'PROFILE_PICTURE',
  ID_DOCUMENT = 'ID_DOCUMENT',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  LICENSE = 'LICENSE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  VEHICLE_INSURANCE = 'VEHICLE_INSURANCE',
  VEHICLE_INSPECTION_REPORT = 'VEHICLE_INSPECTION_REPORT',
  VEHICLE_PHOTO = 'VEHICLE_PHOTO',
  ROADWORTHY_CERTIFICATE = 'ROADWORTHY_CERTIFICATE',
  BUSINESS_REGISTRATION_CERTIFICATE = 'BUSINESS_REGISTRATION_CERTIFICATE',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  TAX_CLEARANCE_CERTIFICATE = 'TAX_CLEARANCE_CERTIFICATE',
  COMPANY_PROFILE = 'COMPANY_PROFILE',
  COMPANY_LOGO = 'COMPANY_LOGO',
  BUSINESS_ADDRESS_PROOF = 'BUSINESS_ADDRESS_PROOF',
  CAMPAIGN_VIDEO = 'CAMPAIGN_VIDEO',
  CAMPAIGN_PICTURE = 'CAMPAIGN_PICTURE',
  OTHER = 'OTHER'
}

export interface ApplicationDocument {
  id: number;
  name: string;
  type: string;
  url: string;
  purpose: DocumentPurpose;  // Changed from documentPurpose to purpose
  uploadedDate: Date;
}
export interface UserDocuments {
  id: number;
  name: string;
  fileType: string;
  documentPurpose: string;
  creationDate: string;
  downloadUrl?: string;
}

interface VehicleInformationrmationRequest {
  capacity: string;
  colour: string;
  licenseRegistrationNo: string;
  isPublic: boolean;
  creationDate: string;
  transportType: TransportType;
  vehicleType: VehicleType;
  userInformationId: number;
  make?: string;
  model?: string;
  year?: string;
  plateNumber?: string;
}