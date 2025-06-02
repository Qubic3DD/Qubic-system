import { Injectable } from '@angular/core';
import { RequestSenderService } from '../core/request-sender.service';
import { BaseRequest } from '../api/Request/base-request';
import { Observable, BehaviorSubject } from 'rxjs';
import { Services } from '../core/services';
import { tap } from 'rxjs/operators';
import { Advertiser } from '../../app/model/adverrtiser.model';

@Injectable({
  providedIn: 'root'
})
export class AdvertiserProviderService {
  private _baseRequest: BaseRequest = new BaseRequest();
  private _advertisers$ = new BehaviorSubject<Advertiser[]>([]);

  constructor(private _http: RequestSenderService) {}

  get advertisers$(): Observable<Advertiser[]> {
    return this._advertisers$.asObservable();
  }

  loadAdvertisers(): Observable<{ data: Advertiser[] }> {
    return this._http.sendGetRequest<{ data: Advertiser[] }>(
      Services.GET_ADVERTISERS,
      this._baseRequest
    ).pipe(
      tap(response => {
        this._advertisers$.next(response.data || []);
      })
    );
  }
}
