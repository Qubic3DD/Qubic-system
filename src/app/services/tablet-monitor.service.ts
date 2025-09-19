import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';

export interface TabletMonitorRow {
  deviceId: string;
  alias?: string;
  driverId?: number;
  lastSeenAt?: string;
  online: boolean;
  appVersion?: string;
  batteryPercent?: number;
  ipAddress?: string;
  impressions?: number;
  model?: string;
  serialNumber?: string;
  osVersion?: string;
  storageGb?: number;
  screenInches?: string;
  assignedAt?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TabletMonitorService {
  private baseUrl = `${environment.api}api/tablets`;

  constructor(private http: HttpClient) {}

  getMonitor(): Observable<{ data: TabletMonitorRow[] }> {
    return this.http.get<{ data: TabletMonitorRow[] }>(`${this.baseUrl}/monitor`);
  }

  register(deviceId: string, alias?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { deviceId, alias });
  }

  assign(deviceId: string, driverId: number, alias?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/assign`, { deviceId, driverId, alias });
  }

  unassign(deviceId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/unassign`, { deviceId });
  }

  delete(deviceId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/device/${encodeURIComponent(deviceId)}`);
  }

  getImpressions(deviceId: string): Observable<number> {
    return this.http.get<number>(`${environment.api}api/impressions/count/device/${encodeURIComponent(deviceId)}`);
  }

  update(deviceId: string, payload: Partial<TabletMonitorRow & { alias: string }>): Observable<any> {
    return this.http.put(`${this.baseUrl}/device/${encodeURIComponent(deviceId)}`, payload);
  }
}


