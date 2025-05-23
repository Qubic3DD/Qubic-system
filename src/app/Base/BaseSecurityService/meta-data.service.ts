import { Injectable } from '@angular/core';
import { MetaData } from '../BaseSecurity/meta-data';
import { BaseConstants } from './base-constants';
import { DeviceInfoServiceService } from './device-info-service.service';

@Injectable({
  providedIn: 'root'
})
export class MetaDataService {

  constructor(private _device :DeviceInfoServiceService) { }

  getMetaData():MetaData{
    const metaData:MetaData  = new MetaData();
      metaData.companyId=BaseConstants.COMPANY;
      metaData.countryCode="";
      metaData.userdevice= this._device.getUserDevice();

      return metaData;
  }
}
