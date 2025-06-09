export interface Tablet {
  id?: number;
  model?: string;
  serialNumber?: string;
  storage?: string;
  screen?: string;
  os?: string;
  status?: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'LOST' | 'DECOMMISSIONED';
  createdAt?: string | null;    // ISO date string
  lastUpdated?: string | null;  // ISO date string
  assignedDate?: string | null; // ISO date string
  user?: UserInfo | null;
}

export interface UserInfo {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;  // matches backend field name
  city?: string;
  country?: string;
}

// DTO for create/update requests (excluding fields usually set by backend)
export interface TabletCreateDto {
  model: string;
  serialNumber: string;
  storage?: string;
  screen?: string;
  os?: string;
}

export interface TabletUpdateDto {
  model?: string;
  serialNumber?: string;
  storage?: string;
  screen?: string;
  os?: string;
  status?: Tablet['status'];
  assignedDate?: string | null;
}
