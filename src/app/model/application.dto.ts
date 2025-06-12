import { Role } from "../services/role.enum";

export interface ApplicationDto {
  id: number;
  email: string;
  profileImage?: string;
  phoneNo: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  submissionDate: Date;
  approvalDate?: Date;
  status: string; // Corresponds to ApplicationStatus in backend
  idNumber: string;
  licenseType: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  location?: string;

  // Business Information
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

  // Contact Information
  contactPerson?: string;
  contactTitle?: string;
  supportContact?: string;

  // Profile Information
  disability?: string;
  bio?: string;
  languages?: string[];
  logo?: string;
  businessLicenseUrl?: string;
  socialLinks?: string;

  // Verification & Status
  verified?: boolean;
  verificationDate?: string;
  documentsVerified?: boolean;
  reviewed?: boolean;
  approved?: boolean;
  rejected?: boolean;
  rejectionReason?: string;

  // Ratings & Metrics
  rating?: number;
  reviewsCount?: number;
  fleetRating?: number;
  revenue?: number;
  completedJobs?: number;
  activeCampaigns?: number;
  activeContracts?: number;
  numberOfDrivers?: number;

  availableVehicleTypes?: string[];
  preferredOperatingAreas?: string[];

  // Subscription
  subscriptionPlan?: string;
  subscriptionExpiry?: string;

  // Documents
  documents?: ApplicationDocument[];
  vehicleInformation?: VehicleInformation[];
}

export interface ApplicationDocument {
  id: number;
  name: string;
  type: string;
  url: string;
  purpose: DocumentPurpose;
  uploadedDate: Date;
}

export interface VehicleInformation {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vehicleType: string;
}

export enum DocumentPurpose {
  ID_DOCUMENT = 'ID_DOCUMENT',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  OPERATING_LICENSE = 'OPERATING_LICENSE',
  BUSINESS_REGISTRATION = 'BUSINESS_REGISTRATION',
  TAX_CLEARANCE = 'TAX_CLEARANCE'
}
