import { DocumentPurpose } from "../api/Response/interfaceAproval";
import { ApplicationStatus } from "../services/application-status";
import { Role } from "../services/role.enum";
import { VehicleInformationrmation } from "./adverrtiser.model";

export interface ApplicationDto {
lastUpdated: any;
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
    submissionDate?: string | Date;
  approvalDate?: string | Date;
missingDocuments?:DocumentPurpose[];
  type?: string;
  roles: Role[];
  status: ApplicationStatus; // Corresponds to ApplicationStatus in backend
  idNumber: string;
  licenseType: string;
  dateOfBirth?: Date;
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
  VehicleInformationrmation?: VehicleInformationrmation[];
}


export interface UploadedDocuments {
viewUrl: any;
  campaignId: number;
  id: number;
  name?: string ;
  fileType?: string;
  filePath?:string;
  url?: string;
  userInformationId?:number;
  documentPurpose: DocumentPurpose;
  creationDate: Date;
  fileSize?: number; 


}


