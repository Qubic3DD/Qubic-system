export interface Advertiser {
  id:number;
accountId: number;
  username: string;
  email: string;
  fullName: string;
  profile: any | null; // Can be replaced with a concrete type if known
  phoneNo: string;
  roles: string[];
  userHandle: string;
  creationDate: string;
  userInfoId: number;
  firstName: string;
  lastName: string;
  gender: string | null;
  idNumber: string | null;
  licenseType: string | null;
  dateOfBirth: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  serviceInformation: ServiceInformation | null;
  companyName: string | null;
  website: string | null;
  disability: string | null;
  bio: string | null;
  rating: number | null;
  languages: string[];
  vehicleInformation: VehicleInformation[];
  uploadedDocuments: UploadedDocument[];
  uploadedMediaFiles: any | null;
  idno: string | null;
  company: boolean;
}
export interface VehicleInformation {
  capacity: string;
  colour: string;
  licenseRegistrationNo: string;
  creationDate: string | null;
  transportType: string | null;
  vehicleType: string | null;
  userInformationId: number | null;
  public: boolean;
}
export interface UploadedDocument {
  id: number;
  name: string;
  fileType: 'IMAGE' | 'VIDEO' | string;
  filePath: string;
  creationDate: string;
  userInformationId: number | null;
  campaignId: number | null;
  documentPurpose: 'PROFILE_PICTURE' | 'CAMPAIGN_VIDEO' | string;
}
export interface ServiceInformation {
  // Add real properties if known
}
