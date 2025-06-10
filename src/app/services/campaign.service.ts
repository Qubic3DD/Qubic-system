import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../model/campaign.model';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
private baseUrl = `${environment.api}/api/campaigns`;

  constructor(private http: HttpClient) {}

  getAllCampaigns(): Observable<{ data: Campaign[] }> {
    return this.http.get<{ data: Campaign[] }>(`${this.baseUrl}/get-all`);
  }

  getCampaignById(id: number): Observable<{ data: Campaign }> {
    return this.http.get<{ data: Campaign }>(`${this.baseUrl}/get-by-id/${id}`);
  }

  deactivateCampaign(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/deactivate/${id}`);
  }

  deleteCampaign(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  createCampaign(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, formData);
  }

  getCampaignsByAdvertiserId(advertiserId: number): Observable<any> {
    return this.http.get<{ data: Campaign[] }>(
      `${this.baseUrl}/getByAdvertiserId/${advertiserId}`
    );
  }
}
