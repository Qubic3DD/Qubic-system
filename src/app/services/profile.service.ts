import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Province } from '../pagess-advertiser/campaign/campaign/add-campaign/add-campaign.component';

interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private apiUrl = `${environment.api}provinces`;

  constructor(private http: HttpClient) { }



  getProvinceById(id: number): Observable<ApiResponse<Province>> {
    return this.http.get<ApiResponse<Province>>(`${this.apiUrl}/${id}`);
  }



  // Get all provinces (if you want to keep it here instead of separate service)
  getAllProvinces(): Observable<ApiResponse<Province[]>> {
    // Live:
    // return this.http.get<ApiResponse<Province[]>>(`https://backend.qubic3d.co.za/api/campaigns/campaign/getByprovince`);
    // Local via env/proxy:
    return this.http.get<ApiResponse<Province[]>>(`${environment.api}api/campaigns/campaign/getByprovince`);
  }
}