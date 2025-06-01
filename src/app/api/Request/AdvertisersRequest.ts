import { BaseRequest } from "./base-request";

interface Document {
  name: string;
  fileType: string;
  filePath: string;
  documentPurpose: string;
  file?: File;
}

type VehicleInformation = {
  capacity: string;
  colour: string;
  licenseRegistrationNo: string;
  transportType: string;
  vehicleType: string;
  public: boolean;
};

export class AdvertisersRequest extends BaseRequest {

  id: number | null = null;
  username: string | null = null;
  email: string | null = null;
  phoneNo: string | null = null;
  firstName: string | null = null;
  lastName: string | null = null;
  userHandle: string | null = null;
  roles: string[] = [];
  gender: string | null = null;
  idNumber: string | null = null;
  licenseType: string | null = null;
  dateOfBirth: string | null = null;
  address: string | null = null;
  city: string | null = null;
  postalCode: string | null = null;
  country: string | null = null;
  serviceInformation: any = null;
  companyName: string | null = null;
  website: string | null = null;
  disability: string | null = null;
  bio: string | null = null;
  languages: string[] = [];
  vehicleInformation: VehicleInformation[] = [];
  uploadedDocuments: Document[] = [];
  idno: string | null = null;
  company: boolean = false;    

  
  token: string;
  data: any;
  message: string;


  constructor(token: string = "", data: any = {}, message: string = "") {
    super();
    this.token = token;
    this.data = data;
    this.message = message;
  }
}