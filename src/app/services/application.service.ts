// applications.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment, environmentApplication } from '../environments/environment';
import { ApplicationDto } from '../model/application.dto';
import { DocumentPurpose } from './document-purpose';


@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  uploadDocument(id: number, formData: FormData, selectedDocumentPurpose: DocumentPurpose) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environmentApplication.api}applications`;

  constructor(private http: HttpClient) { }

  getApplicationByEmail(email: string): Observable<ApplicationDto[]> {
    return this.http.get<ApplicationDto[]>(`${this.apiUrl}/application-by-email`, {
      params: { email }
    });
  }

  downloadDocument(applicationId: number, documentPurpose: DocumentPurpose): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${applicationId}/documents/download`, {
      params: { documentPurpose },
      responseType: 'blob'
    });
  }

  viewDocument(applicationId: number, documentPurpose: DocumentPurpose): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${applicationId}/documents/view`, {
      params: { documentPurpose },
      responseType: 'blob'
    });
  }
}