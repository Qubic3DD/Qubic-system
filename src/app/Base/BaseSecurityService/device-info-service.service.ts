import { Injectable } from '@angular/core';
import { UserDevice } from '../BaseSecurity/user-device';
import { GeoLocationServiceService } from './geo-location-service.service';
import { BaseConstants } from './base-constants';

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoServiceService {

  constructor(private _location : GeoLocationServiceService) { }

  getUserDevice(): UserDevice {
    const userDevice = new UserDevice();

 
    userDevice.os = navigator.platform;
    userDevice.url = BaseConstants.URL;
    userDevice.appId = BaseConstants.APP_ID;
    userDevice.appCode = BaseConstants.APP_CODE;
    userDevice.appVersion = BaseConstants.APP_VERSION;
    userDevice.modelName = navigator.userAgent;
    userDevice.brandName = navigator.vendor;
    userDevice.imeinumber = 'web-browser';
    userDevice.serialNumber = 'web-browser';
    userDevice.alias = 'web_brower';
    userDevice.description = 'Web Browser';
    userDevice.brandDescription = 'Web Browser';
    userDevice.appNameCode=BaseConstants.APP_NAME;
    userDevice.ipaddress='Web Browser';
    userDevice.macAddress='web-browser'
    return userDevice;
  }
}
