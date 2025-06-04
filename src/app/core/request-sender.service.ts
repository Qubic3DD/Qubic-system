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
      'Access-Control-Allow-Origin': 'http://localhost:4200',
    });

    return this.http.post<T>(environment.api + url, JSON.stringify(body), {
      headers,
      responseType: 'text' as 'json',
    });
  }

  //   sendGetRequest<T>(url: string, params?: any): Observable<T> {
  //     const headers = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Origin': 'http://localhost:4200',
  //     });

  //     const requestParams = params || {};
  //     requestParams.metaData = this.meta.getMetaData();

  //     return this.http.get<T>(environment.api + url, {
  //       headers,
  //       params: requestParams
  //     });
  // }

  sendGetRequest<T>(
    url: string,
    params?: any,
    usePathParam: boolean = false
  ): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
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

  sendRequest<T>(url: string, body: any): Observable<T[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
    });
    body.metaData = this.meta.getMetaData();
    return this.http
      .post<Response<T>>(environment.api + url, JSON.stringify(body), {
        headers,
      })
      .pipe(
        map((response: Response<T>) => {
          return response.passed; // Assuming `passed` is the property you want to extract
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMsg: string;
          if (error.status === 500) {
            errorMsg = 'Internal server error occurred psl Try again later';
          } else if (error.status === 400) {
            errorMsg = error.error.errors[0];
          } else {
            errorMsg = 'An unexpected error occurred pls Try again later';
          }
          console.log('Error:', error);
          return throwError(errorMsg);
        })
      );
  }
}
