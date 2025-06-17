// vehicle.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleInfo } from '../api/Response/interfaces';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.api}/vehicles`;

  constructor(private http: HttpClient) {}

  getVehiclesByUserEmail(email: string): Observable<VehicleInfo[]> {
    return this.http.get<VehicleInfo[]>(`${this.apiUrl}/user/${email}`);
  }

  addVehicle(vehicle: VehicleInfo): Observable<VehicleInfo> {
    return this.http.post<VehicleInfo>(this.apiUrl, vehicle);
  }

  updateVehicle(id: number, vehicle: VehicleInfo): Observable<VehicleInfo> {
    return this.http.put<VehicleInfo>(`${this.apiUrl}/${id}`, vehicle);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}