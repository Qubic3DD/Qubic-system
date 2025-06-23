

// vehicle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentApplication } from '../environments/environment';
import { VehicleResponse } from '../components/application-dashboard/vehicle-response.model';
import { DocumentPurpose } from './document-purpose';
import { VehicleInformationrmation } from '../model/adverrtiser.model';
import { TransportType } from './transport-type.enum';
import { VehicleType } from './vehicle-type.enum';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environmentApplication.api}vehicles`;

  constructor(private http: HttpClient) {}
 
  getVehicleById(id: number): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/${id}`);
  }

  saveVehicle(vehicleData: VehicleInformationrmation): Observable<VehicleInformationrmation> {
    return vehicleData.id 
      ? this.http.put<VehicleInformationrmation>(`${this.apiUrl}/${vehicleData.id}`, vehicleData)
      : this.http.post<VehicleInformationrmation>(this.apiUrl, vehicleData);
  }
createVehicle(vehicle: VehicleInformationrmation): Observable<VehicleInformationrmation> {
  return this.http.post<VehicleInformationrmation>(this.apiUrl, vehicle);
}

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getVehiclesByUserEmail(email: string): Observable<VehicleInformationrmation[]> {
    return this.http.get<VehicleInformationrmation[]>(`${this.apiUrl}`, {
      params: { email }
    });
  }

  addVehicle(vehicle: VehicleInformationrmation): Observable<VehicleInformationrmation> {
    return this.http.post<VehicleInformationrmation>(this.apiUrl, vehicle);
  }
updateVehicle(vehicleId: number, vehicleData: VehicleInformationrmation): Observable<VehicleInformationrmation> {
  return this.http.put<VehicleInformationrmation>(`${this.apiUrl}/${vehicleId}`, vehicleData);
}

  uploadVehicleImage(
    vehicleId: number,
    file: File,
    purpose: DocumentPurpose,
    licensePlate?: string
  ): Observable<VehicleImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    if (licensePlate) {
      formData.append('licensePlate', licensePlate);
    }

    return this.http.post<VehicleImageResponse>(
      `${this.apiUrl}/${vehicleId}/images`,
      formData
    );
  }

  getVehicleImages(vehicleId: number): Observable<VehicleImageResponse[]> {
    return this.http.get<VehicleImageResponse[]>(
      `${this.apiUrl}/${vehicleId}/images`
    );
  }

  getVehicleImageUrl(imageId: number): string {
    return `${this.apiUrl}/images/${imageId}`;
  }

}


export interface VehicleFormModel {
  id?: number;
  vehicleType: VehicleType;
  licensePlate: string;
  capacity: string;
  color: string;
  year: string;
  vehicleImage: File | null;
  transportType?: TransportType;
  make?: string;
  model?: string;
}


export interface VehicleImageResponse {
  id: number;
  vehicleId?: number;
  imageUrl?: string;
  purpose?: DocumentPurpose;
  uploadedDate?: Date;
}