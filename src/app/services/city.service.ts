import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { City, Province } from '../pagess-advertiser/campaign/campaign/add-campaign/add-campaign.component';

interface ApiResponse<T> {
  token?: string | null;
  data: T;
  message?: string;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = `${environment.api}cities`;
  private apCity = 'http://192.168.8.100:8443/api/campaigns/campaigs/getAllCities'
  constructor(private http: HttpClient) { }

  // Get all cities (for initial load)
  getAllCities(): Observable<ApiResponse<City[]>> {
    return this.http.get<ApiResponse<City[]>>(`${this.apCity}`);
  }

  // Get cities by province (for filtering)
  getCitiesByProvince(provinceId: number): Observable<ApiResponse<City[]>> {
    return this.http.get<ApiResponse<City[]>>(`${this.apiUrl}/by-province/${provinceId}`);
  }

  // Get cities by multiple provinces
  getCitiesByProvinces(provinceIds: number[]): Observable<ApiResponse<City[]>> {
    // If your backend supports batch province filtering
    return this.http.post<ApiResponse<City[]>>(`${this.apiUrl}/by-provinces`, { provinceIds });
    
    // Alternative if backend doesn't support batch filtering:
    // return forkJoin(provinceIds.map(id => this.getCitiesByProvince(id))).pipe(
    //   map(responses => ({
    //     data: responses.flatMap(r => r.data),
    //     message: 'Cities loaded successfully',
    //     timestamp: new Date().toISOString()
    //   }))
    // );
  }


}