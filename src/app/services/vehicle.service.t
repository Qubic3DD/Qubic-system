import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleInfo, VehicleInfo2 } from '../api/Response/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  getVehiclesByUserEmail(email: string): Observable<VehicleInfo2[]> {
    return this.http.get<VehicleInfo2[]>(`${this.apiUrl}/user/${email}`);
  }

  addVehicle(vehicle: VehicleInfo): Observable<VehicleInfo2> {
    return this.http.post<VehicleInfo2>(this.apiUrl, vehicle);
  }

  updateVehicle(id: number, vehicle: VehicleInfo): Observable<VehicleInfo2> {
    return this.http.put<VehicleInfo2>(`${this.apiUrl}/${id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}export interface VehicleInfo {
  capacity: string;
  colour: string;
  licenseRegistrationNo: string;
  transportType: string;
  vehicleType: string;
  make?: string;
  model?: string;
  year?: number;
  plateNumber?: string;
  public: boolean;
  userInformationId?: number | null;
  creationDate?: string;
}

export interface VehicleInfo2 extends VehicleInfo {
  id: number;
  creationDate: string;
}