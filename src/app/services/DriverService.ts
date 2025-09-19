import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DriverProfile } from '../api/Response/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DriverService {

  // Live:
  // private apiUrl = 'https://backend.qubic3d.co.za/profile/drivers';
  // Local via env/proxy:
  private apiUrl = `${environment.api}profile/drivers`;

  constructor(private http: HttpClient) {}

  // Method that returns Observable<DriverProfile[]>
  fetchDriversd(): Observable<DriverProfile[]> {
    return this.http.get<{ data: DriverProfile[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
    
  }
}
