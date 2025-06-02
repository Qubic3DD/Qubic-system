import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvertiserService {
  private baseUrl = 'http://41.76.110.219:8181/profile/advertisers';

  constructor(private http: HttpClient) { }

  getAllAdvertisers(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(this.baseUrl);
  }
}