import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../environments/environment.development';
import { MetaDataService } from '../Base/BaseSecurityService/meta-data.service';
import { Response } from '../api/Response/Response';

@Injectable({
  providedIn: 'root',
})
export class RequestSenderService {
  constructor(private http: HttpClient, private meta: MetaDataService) {}

  sendPostRequest<T>(url: string, body: any): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://196.168.8.29:8443',
    });

    return this.http.post<T>(environment.api + url, JSON.stringify(body), {
      headers,
      responseType: 'text' as 'json',
    });
  }

  sendGetRequest<T>(
    url: string,
    params?: any,
    usePathParam: boolean = false
  ): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://196.168.8.29:8443',
    });

    let finalUrl = environment.api + url;
    let requestParams = params || {};

    // Handle path parameter if needed
    if (usePathParam && params?.username) {
      const encodedUsername = encodeURIComponent(params.username);
      finalUrl = `${finalUrl}/${encodedUsername}`;
      // Remove username from query params
      requestParams = { ...requestParams };
      delete requestParams.username;
    }

    requestParams.metaData = this.meta.getMetaData();

    return this.http.get<T>(finalUrl, {
      headers,
      params: requestParams,
    });
  }
}
