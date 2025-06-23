import { VehicleInformationrmation } from "../../model/adverrtiser.model";

// interfaces.ts
export interface ApiResponse<T> {
  token: string | null;
  data: T;
  message: string;
  timestamp: string;
}

export interface DriverProfile {
  id:number;
  accountId: number;
  username: string;
  email: string;
  fullName: string;
  profile: string;
  phoneNo: string;
  roles: string[];
  userHandle: string;
  creationDate: string;
  userInfoId: number;
  firstName: string;
  lastName: string;
  gender: string;
  idNumber: string;
  licenseType: string;
  dateOfBirth: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  serviceInformation: string;
  companyName: string;
  website: string;
  disability: string;
  bio: string;
  rating: number | null;
  languages: string[];
  VehicleInformationrmation: VehicleInformationrmation[];
  uploadedDocuments: UserDocument[]; // Consider creating a specific interface for documents
  uploadedMediaFiles: UserDocument[]; // Consider creating a specific interface for media files
  idno: string | null;
  company: boolean;
}



export interface UserDocument {
  id: number;
  name: string;
  fileType: string;
  filePath: string;
  creationDate: string;
  userInformationId: number;
  campaignId: number;
  documentPurpose: string;
  downloadUrl?: string;
}

export interface UserDocument {
  id: number;
  name: string;
  fileType: string;
  documentPurpose: string;
  creationDate: string;
  downloadUrl?: string;
}