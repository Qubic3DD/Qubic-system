// vehicle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environmentApplication } from '../environments/environment';
import { VehicleResponse } from '../components/application-dashboard/vehicle-response.model';
import { DocumentPurpose } from './document-purpose';

import { TransportType } from './transport-type.enum';
import { VehicleType } from './vehicle-type.enum';
import { VehicleInformationrmation } from '../model/adverrtiser.model';
import { id } from '@swimlane/ngx-charts';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environmentApplication.api}vehicles`;

  constructor(private http: HttpClient) {}
// vehicle.service.ts

addVehicleToApplication(applicationId: number, vehicleData: any): Observable<VehicleInformationrmation> {
  return this.http.post<VehicleInformationrmation>(
    `${this.apiUrl}/application/${applicationId}`,
    vehicleData
  );
}

getVehiclesByApplication(applicationId: number): Observable<VehicleInformationrmation[]> {
  return this.http.get<VehicleInformationrmation[]>(
    `${this.apiUrl}/application/${applicationId}`
  ).pipe(
    catchError(error => {
      console.error('Error fetching vehicles:', error);
      return of([]); // Return empty array on error
    })
  );
}

  // Basic CRUD operations
  getVehicleById(id: number): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/${id}`);
  }

  getVehiclesByUserEmail(email: string): Observable<VehicleInformationrmation[]> {
    return this.http.get<VehicleInformationrmation[]>(`${this.apiUrl}`, {
      params: { email }
    });
  }

  createVehicle(vehicle: VehicleInformationrmation): Observable<VehicleInformationrmation> {
    return this.http.post<VehicleInformationrmation>(this.apiUrl, vehicle);
  }

updateVehicle( vehicle: VehicleInformationrmation): Observable<VehicleInformationrmation> {
    if (!vehicle?.id) {
      return throwError(() => new Error('Vehicle ID is required for update'));
    }
    return this.http.put<VehicleInformationrmation>(
      `${this.apiUrl}/${vehicle.id}`,
      vehicle
    ).pipe(
      catchError(error => {
        console.error('Error updating vehicle:', error);
        return throwError(() => error);
      })
    );
  }

  // In VehicleService

uploadVehicleImage(vehicleId: number, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(
    `${this.apiUrl}/${vehicleId}/images`,
    formData,
    { 
      params: { purpose: DocumentPurpose.VEHICLE_PHOTO },
      reportProgress: true,
      observe: 'events'
    }
  ).pipe(
    catchError(error => {
      console.error('Error uploading vehicle image:', error);
      return throwError(() => error);
    })
  );
}

deleteVehicle(id: number): Observable<void> {
    if (!id) {
      return throwError(() => new Error('Vehicle ID is required'));
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting vehicle:', error);
        return throwError(() => error);
      })
    );
  }
  // Combined save method that handles both create and update
  saveVehicle(vehicleData: VehicleInformationrmation): Observable<VehicleInformationrmation> {
    return vehicleData.id 
      ? this.updateVehicle(vehicleData)
      : this.createVehicle(vehicleData);
  }


  // getVehicleImages(vehicleId: number): Observable<VehicleImageResponse[]> {
  //   return this.http.get<VehicleImageResponse[]>(
  //     `${this.apiUrl}/${vehicleId}/images`
  //   );
  // }
  // In your VehicleService
getVehicleImages(vehicleId: number): Observable<VehicleImageResponse[]> {
    return this.http.get<VehicleImageResponse[]>(`${this.apiUrl}/${vehicleId}/images`);
}

getVehicleImageUrl(vehicleId: number): Observable<string | null> {
  return this.getVehicleImages(vehicleId).pipe(
    map(images => {
      if (!images || images.length === 0) return null;

      const imageId = images[0].id;

      // Construct the final image download/render URL
      return `${environmentApplication.api}vehicles/images/${imageId}`;
    }),
    catchError(error => {
      console.error(`Failed to get image for vehicle ID ${vehicleId}`, error);
      return of(null);
    })
  );
}



}

export interface VehicleFormModel {
  id?: number;
  vehicleType: VehicleType;
  licensePlate: string;
  capacity: string;
  colour: string;
  year: string;
  vehicleImage: File | null;
  transportType?: TransportType;
  make?: string;
  model?: string;
}

export interface VehicleImageResponse {
  id: number;
  vehicleId?: number;
  fileName?: string;
  fileType?: string;
  filePath?: string;
  downloadUrl?: string; // <-- this is the image URL you want
  uploadedAt?: Date;
  documentPurpose?: string;
  licensePlate?: string | null;
}
