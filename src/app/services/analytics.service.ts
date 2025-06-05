// analytics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = 'https://41.76.110.219:8443/api/analytics';

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
