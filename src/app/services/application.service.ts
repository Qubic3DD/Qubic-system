// applications.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environmentApplication } from '../environments/environment';
import { ApplicationDto } from '../model/application.dto';
import { DocumentPurpose } from './document-purpose';
import { ApiResponse } from '../api/Response/interfaceAproval';


@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private apiUrl = `${environmentApplication.api}applications`;

  constructor(private http: HttpClient) { }

  // Basic CRUD operations
  getApplications(): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(this.apiUrl);
  }

  getApplicationById(id: number): Observable<ApplicationDto> {
    return this.http.get<ApplicationDto>(`${this.apiUrl}/${id}`);
  }

  getApplicationByEmail(email: string): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/by-email`, {
      params: { email }
    });
  }

  createApplication(application: ApplicationDto): Observable<ApplicationDto> {
    return this.http.post<ApplicationDto>(this.apiUrl, application);
  }

  updateApplication(id: number, application: ApplicationDto): Observable<ApplicationDto> {
    return this.http.put<ApplicationDto>(`${this.apiUrl}/${id}`, application);
  }
getMissingDocuments(applicationId: number): Observable<DocumentPurpose[]> {
  return this.http.get<ApiResponse<DocumentPurpose[]>>(
    `${this.apiUrl}/${applicationId}/missing-documents`
  ).pipe(
    map(response => response.data || []), // Ensure we always return an array
    catchError(error => {
      console.error('API Error fetching missing documents:', error);
      return of([]); // Return empty array on error
    })
  );
}


  /**
   * Delete a specific document from an application
   * @param applicationId The ID of the application
   * @param documentPurpose The purpose/type of document to delete
   */
  deleteDocument(
    applicationId: number, 
    documentPurpose: DocumentPurpose
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${applicationId}/documents`,
      {
        params: { documentPurpose }
      }
    );
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Document handling
  uploadDocument(
    applicationId: number, 
    file: File, 
    documentPurpose: DocumentPurpose
  ): Observable<ApplicationDto> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentPurpose', documentPurpose);

    return this.http.post<ApplicationDto>(
      `${this.apiUrl}/${applicationId}/documents`,
      formData
    );
  }

  downloadDocument(
    applicationId: number, 
    documentPurpose: DocumentPurpose
  ): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${applicationId}/documents/download`, {
      params: { documentPurpose },
      responseType: 'blob'
    });
  }

  viewDocument(
    applicationId: number, 
    documentPurpose: DocumentPurpose
  ): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${applicationId}/documents/view`, {
      params: { documentPurpose },
      responseType: 'blob'
    });
  }

  // Status management
  updateApplicationStatus(
    id: number, 
    status: string
  ): Observable<ApplicationDto> {
    return this.http.patch<ApplicationDto>(
      `${this.apiUrl}/${id}/status`,
      { status }
    );
  }
}