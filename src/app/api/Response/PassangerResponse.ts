export interface PassangerResponse {
    id: number;
    email: string;
    profile: any;
    phoneNo: string;
    userName: string;
    userHandle: string;
    roles: string[];
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
    serviceInformation: any;
    companyName: string | null;
    website: string | null;
    disability: string | null;
    bio: string | null;
    languages: string[];
    vehicleInformation: any[];
    uploadedDocuments: any[];
    username: string;
    idno: string | null;
    company: boolean;
    logo: string | null;
    status: string| null;
    revenue: 2000;
    createdAt: string;
    updatedAt: string;
    verified:boolean;

}