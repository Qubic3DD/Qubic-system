import { TransportType } from "../../services/transport-type.enum";
import { VehicleType } from "../../services/vehicle-type.enum";

export interface VehicleResponse {
  id: number;
  capacity: string;
  colour: string;
  licenseRegistrationNo: string;
  isPublic: boolean;
  creationDate: Date | string; // Can be Date object or ISO string
  transportType: TransportType;
  vehicleType: VehicleType;
  make?: string; // Optional as it might be null
  model?: string; // Optional as it might be null
  year?: number; // Optional as it might be null
  plateNumber?: string; // Optional as it might be null
  userInformationId: number;
}