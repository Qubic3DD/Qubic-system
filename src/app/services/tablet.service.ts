import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment.development'
import { DriverProfile } from '../api/Response/interfaces';

export interface Tablet {
  id: number;
  model: string;
  serialNumber: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'LOST' | 'DECOMMISSIONED';
  assignedDate: string | null;
  lastUpdated: string;
  storage?: string;
  screen?: string;
  os?: string;
  userInformation?: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber: string;
  };
}

export interface TabletCreateDto {
  model: string;
  serialNumber: string;
  storage?: string;
  screen?: string;
  os?: string;
}

export interface TabletUpdateDto {
  model?: string;
  serialNumber?: string;
  storage?: string;
  screen?: string;
  os?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TabletService {
  private apiUrl = `${environment.api}/api/tablets`;

  constructor(private http: HttpClient) { }

  /**
   * Get all tablets
   */
  getAllTablets(): Observable<Tablet[]> {
    return this.http.get<Tablet[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get a single tablet by ID
   */
  getTabletById(id: number): Observable<Tablet> {
    return this.http.get<Tablet>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Create a new tablet
   */
  createTablet(tablet: TabletCreateDto): Observable<Tablet> {
    return this.http.post<Tablet>(this.apiUrl, tablet)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update an existing tablet
   */
  updateTablet(id: number, tablet: TabletUpdateDto): Observable<Tablet> {
    return this.http.put<Tablet>(`${this.apiUrl}/${id}`, tablet)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a tablet
   */
  deleteTablet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Search tablets by model or serial number
   */
  searchTablets(query: string): Observable<Tablet[]> {
    return this.http.get<Tablet[]>(`${this.apiUrl}/search`, {
      params: { query }
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get tablets by status
   */
  getTabletsByStatus(status: Tablet['status']): Observable<Tablet[]> {
    return this.http.get<Tablet[]>(`${this.apiUrl}/status/${status}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Assign a tablet to a user
   */
  assignTablet(tabletId: number, userId: number): Observable<Tablet> {
    return this.http.post<Tablet>(
      `${this.apiUrl}/${tabletId}/assign/${userId}`, 
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Unassign a tablet from its current user
   */
  unassignTablet(tabletId: number): Observable<Tablet> {
    return this.http.post<Tablet>(
      `${this.apiUrl}/${tabletId}/unassign`, 
      {}
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get count of tablets by status
   */
  getTabletCountByStatus(status: Tablet['status']): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, {
      params: { status }
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Could not connect to server';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        // Custom error messages based on status code
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid request data';
            break;
          case 404:
            errorMessage = 'Tablet not found';
            break;
          case 409:
            errorMessage = 'Tablet with this serial number already exists';
            break;
          case 500:
            errorMessage = 'Server error occurred';
            break;
        }
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Add to TabletService interface
getDrivers(search?: string): Observable<DriverProfile[]> {
  return this.http.get<DriverProfile[]>(`${environment.api}/api/users/drivers`, {
    params: search ? { search } : {}
  }).pipe(
    catchError(this.handleError)
  );
}

}