import { DocumentPurpose } from "../api/Response/interfaceAproval";
import { ApplicationStatus } from "../services/application-status";
import { Role } from "../services/role.enum";
import { VehicleInformation } from "./adverrtiser.model";

export interface ApplicationDto {
gender: any;
  role: Role | ApplicationStatus;
  id: number;
  email: string;
  profileImage?: string;
  phoneNo: string;
  applicationRole:Role;
  firstName: string;
  lastName: string;
  fleetSize: number;
  yearsOfExperience: number | 0;
  
  roles: Role[];
 submissionDate: string | Date;  // Allow both string and Date types
  approvalDate?: string | Date;   // Optional and allows both types
  status: string; // Corresponds to ApplicationStatus in backend
  idNumber: string;
  licenseType: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  location?: string;
  applicationStatus?: ApplicationStatus;

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
  uploadedDocuments?: UploadedDocuments[];
  vehicleInformation?: VehicleInformation[];
}


export interface UploadedDocuments {
  id: number;
  name?: string;
  fileType?: string;
  filePath?:string;
  url?: string;
  userInformationId?:number;
  documentPurpose: DocumentPurpose;
  creationDate: Date;
  campaignId: number;

}


