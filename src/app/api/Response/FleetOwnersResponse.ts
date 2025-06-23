export interface FleetOwnersResponse {
  token: string | null;
  data: DriverProfile; // You can reuse DriverProfile for fleet owners
  message: string;
  timestamp: string;
}


export interface DriverProfile {
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
    companyRegistrationNumber: string | null;   // ✅ New: Official company registration number
    companyType: string | null;                // ✅ New: E.g. Pty Ltd, CC, Sole Proprietor
    taxNumber: string | null;                  // ✅ New: For invoicing and compliance
    vatRegistered: boolean;                    // ✅ New: Indicates if they are VAT registered

    bio: string | null;
    disability: string | null;
    languages: string[];

    VehicleInformationrmation: any[];
    uploadedDocuments: any[];

    username: string;
    idno: string | null;
    company: boolean;
    logo: string | null;

    status: string | null;
    revenue: number;

    // ✅ Additional Useful Fields
    numberOfVehicles: number;                 // Total number of vehicles owned
    numberOfDrivers: number;                  // Total drivers under fleet
    fleetRating: number | null;               // Rating based on driver behavior/maintenance
    activeContracts: number;                  // Ongoing service contracts or partnerships
    availableVehicleTypes: string[];          // E.g., [‘Sedan’, ‘Minibus’, ‘Truck’]
    supportContact: string | null;            // Alternative contact for urgent issues
    preferredOperatingAreas: string[];        // Regions the fleet mainly operates in

    lastActive: string | null;                // Last login or usage time
    accountCreatedAt: string | null;          // Fleet owner registration date
    accountUpdatedAt: string | null;          // Last profile update timestamp

    documentsVerified: boolean;               // If uploaded documents are verified
    subscriptionPlan: string | null;          // Name of their subscription tier
    subscriptionExpiry: string | null;        // When their current plan expires

    vehicleCount: number | null;
}


export interface FleetOwnersResponse2 {
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
    companyRegistrationNumber: string | null;   // ✅ New: Official company registration number
    companyType: string | null;                // ✅ New: E.g. Pty Ltd, CC, Sole Proprietor
    taxNumber: string | null;                  // ✅ New: For invoicing and compliance
    vatRegistered: boolean;                    // ✅ New: Indicates if they are VAT registered

    bio: string | null;
    disability: string | null;
    languages: string[];

    VehicleInformationrmation: any[];
    uploadedDocuments: any[];

    username: string;
    idno: string | null;
    company: boolean;
    logo: string | null;

    status: string | null;
    revenue: number;

    // ✅ Additional Useful Fields
    numberOfVehicles: number;                 // Total number of vehicles owned
    numberOfDrivers: number;                  // Total drivers under fleet
    fleetRating: number | null;               // Rating based on driver behavior/maintenance
    activeContracts: number;                  // Ongoing service contracts or partnerships
    availableVehicleTypes: string[];          // E.g., [‘Sedan’, ‘Minibus’, ‘Truck’]
    supportContact: string | null;            // Alternative contact for urgent issues
    preferredOperatingAreas: string[];        // Regions the fleet mainly operates in

    lastActive: string | null;                // Last login or usage time
    accountCreatedAt: string | null;          // Fleet owner registration date
    accountUpdatedAt: string | null;          // Last profile update timestamp

    documentsVerified: boolean;               // If uploaded documents are verified
    subscriptionPlan: string | null;          // Name of their subscription tier
    subscriptionExpiry: string | null;        // When their current plan expires

    vehicleCount: number | null;
}
