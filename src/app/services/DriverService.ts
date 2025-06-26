import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DriverProfile } from '../api/Response/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private apiUrl = 'https://41.76.110.219:8443/profile/drivers';

  constructor(private http: HttpClient) {}

  // Method that returns Observable<DriverProfile[]>
  fetchDriversd(): Observable<DriverProfile[]> {
    return this.http.get<{ data: DriverProfile[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
    
  }
}
