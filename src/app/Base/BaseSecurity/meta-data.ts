import { DeviceInfoServiceService } from "../BaseSecurityService/device-info-service.service";
import { UserDevice } from "./user-device";

export class MetaData {
    userdevice: UserDevice = new UserDevice;
 
	companyId!: Number;

    countryCode!: String;

}
