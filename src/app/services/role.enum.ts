export enum Role {
  DRIVER = 'DRIVER',
  FLEET_OWNER = 'FLEET_OWNER',
  AGENCY = 'AGENCY',
  ADVERTISER = 'ADVERTISER',
  APPLICANT = 'APPLICANT',
  ADMIN = 'ADMIN' // Added admin role for completeness
}

export interface RoleConfig {
  label: string;
  description: string;
  iconPath: string;
  route: string;
  requiresPassword: boolean;
  applicationRoute: string; // New field for application path
  canApply: boolean; // Whether this role can apply directly
  requirements: string[]; // Required documents for application
  colorScheme: string; // Tailwind color scheme
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  [Role.DRIVER]: {
    label: 'Driver Portal',
    description: 'Manage your driving activities and earnings',
    iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    route: '/driver-dashboard',
    applicationRoute: '/apply/driver',
    requiresPassword: true,
    canApply: true,
    colorScheme: 'blue',
    requirements: [
      'Valid driver license',
      'ID document',
      'Proof of address',
      'Vehicle registration (if applicable)'
    ]
  },
  [Role.FLEET_OWNER]: {
    label: 'Fleet Owner Portal',
    description: 'Oversee your vehicle fleet and drivers',
    iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    route: '/fleet-owner-dashboard',
    applicationRoute: '/apply/fleet-owner',
    requiresPassword: true,
    canApply: true,
    colorScheme: 'indigo',
    requirements: [
      'Business registration',
      'Tax clearance certificate',
      'Fleet insurance',
      'ID documents for all drivers'
    ]
  },
  [Role.AGENCY]: {
    label: 'Agency Portal',
    description: 'Coordinate multiple fleets and operations',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    route: '/agency-dashboard',
    applicationRoute: '/apply/agency',
    requiresPassword: true,
    canApply: true,
    colorScheme: 'purple',
    requirements: [
      'Agency license',
      'Operating permits',
      'Insurance documents',
      'Client contracts'
    ]
  },
  [Role.ADVERTISER]: {
    label: 'Advertiser Portal',
    description: 'Manage campaigns and advertising spaces',
    iconPath: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    route: '/advertiser-dashboard',
    applicationRoute: '/apply/advertiser',
    requiresPassword: true,
    canApply: true,
    colorScheme: 'teal',
    requirements: [
      'Business registration',
      'Tax information',
      'Marketing portfolio',
      'Payment details'
    ]
  },
  [Role.APPLICANT]: {
    label: 'Applicant Portal',
    description: 'Track your application status and documents',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    route: '/applicant-dashboard',
    applicationRoute: '/apply/applicant',
    requiresPassword: false,
    canApply: false,
    colorScheme: 'orange',
    requirements: [
      'ID document',
      'Application form',
      'Supporting documents'
    ]
  },
  [Role.ADMIN]: {
    label: 'Admin Portal',
    description: 'System administration and user management',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    route: '/admin-dashboard',
    applicationRoute: '/apply/admin',
    requiresPassword: true,
    canApply: false,
    colorScheme: 'red',
    requirements: []
  }
};