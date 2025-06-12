export enum Role {
  DRIVER = 'DRIVER',
  FLEET_OWNER = 'FLEET_OWNER',
  AGENCY = 'AGENCY',
  ADVERTISER = 'ADVERTISER',
  APPLICANT = 'APPLICANT',
}

export interface RoleConfig {
  label: string;
  description: string;
  iconPath: string;
  route: string;
  requiresPassword: boolean;
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  [Role.DRIVER]: {
    label: 'Driver Portal',
    description: 'Manage your driving activities and earnings',
    iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    route: '/driver-dashboard',
    requiresPassword: true
  },
  [Role.FLEET_OWNER]: {
    label: 'Fleet Owner Portal',
    description: 'Oversee your vehicle fleet and drivers',
    iconPath: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    route: '/fleet-owner-dashboard',
    requiresPassword: true
  },
  [Role.AGENCY]: {
    label: 'Agency Portal',
    description: 'Coordinate multiple fleets and operations',
    iconPath: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    route: '/agency-dashboard',
    requiresPassword: true
  },
  [Role.ADVERTISER]: {
    label: 'Advertiser Portal',
    description: 'Manage campaigns and advertising spaces',
    iconPath: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
    route: '/advertiser-dashboard',
    requiresPassword: true
  },
  [Role.APPLICANT]: {
    label: 'Application',
    description: 'Search and process driver applications',
    iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    route: '/applicant-management',
    requiresPassword: false
  },

};