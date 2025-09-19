import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdvertiserService {
  private baseUrl = '/profile/advertisers';

  constructor(private http: HttpClient) {}

  getAllAdvertisers(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(this.baseUrl);
  }

  deleteAdvertiser(username: string): Observable<any> {
    return this.http.delete(`/api/advertisers/${encodeURIComponent(username)}`);
  }
}
