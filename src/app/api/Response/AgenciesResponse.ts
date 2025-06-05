export interface AgenciesResponse {
    id: number;
    email: string;
    profile: any;
    phoneNo: string;
    userName: string;
    userHandle: string;
    roles: string[];

    // Personal Info
    firstName: string;
    lastName: string;
    gender: string | null;
    dateOfBirth: string | null;
    idNumber: string | null;
    idno: string | null;

    // Business Info
    company: boolean;
    companyName: string | null;
    companyRegistrationNumber: string | null;
    taxNumber: string | null;
    website: string | null;
    companyEmail: string | null;
    companyPhone: string | null;
    fleetCount: number; // Number of vehicles or drivers managed
    coverageAreas: string[]; // Areas serviced
    servicesOffered: string[]; // What they provide
    operatingHours: { open: string; close: string } | null;
    revenue: number;
    completedJobs: number;
    activeCampaigns: number;

    // Contact & Location
    contactPerson: string | null;
    contactTitle: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    location: {
        lat: number;
        lng: number;
        formattedAddress?: string;
    };

    // Profile and Identity
    logo: string | null;
    businessLicenseUrl: string | null;
    bio: string | null;
    disability: string | null;
    languages: string[];
    licenseType: string | null;

    // Verification
    verified: boolean;
    verificationDate: string | null;

    // Social & Online Presence
    socialLinks: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        youtube?: string;
    };

    // System Data
    vehicleInformation: any[];
    uploadedDocuments: any[];
    serviceInformation: any;
    status: string | null;
    rating: number | null;
    reviewsCount: number;

    // Timestamps
    createdAt: string;
    updatedAt: string;

    // Auth/Access
    username: string;
}
