import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  // Live:
  // private apiUrl = 'https://backend.qubic3d.co.za/api/analytics';
  // Local via env/proxy:
  private apiUrl = '/api/analytics';

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<any> {
    const headers = new HttpHeaders({
      accept: '*/*',
      'Content-Type': 'application/json',
    });

    return this.http.get(this.apiUrl, { headers });
  }
}
