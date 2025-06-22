import { TransportType } from "../services/transport-type.enum";
import { VehicleType } from "../services/vehicle-type.enum";
import { VehicleImageResponse } from "../services/vehicle.service";
import { UploadedDocuments } from "./application.dto";

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
  uploadedDocuments: UploadedDocuments[];
  uploadedMediaFiles: any | null;
  idno: string | null;
  company: boolean;
}
export interface VehicleInformation {
  id?: number;
  licensePlate?: string;
  color?: string;
  capacity?: string;
  isPublic?: boolean;
  vehicleType?: VehicleType;
  transportType?: TransportType;
  userInformationId?: number;
  year?: string;
  make?: string ;
  model?: string;
  creationDate?: string;
  vehicleImages?: VehicleImageResponse[];
  licenseRegistrationNo?:string;
  vehicleImageUrl?:string | null;
}

export interface ServiceInformation {
  // Add real properties if known
}
