import { Coordinates } from "./coordinates";

export class UserDevice {
    os?: string;
    macAddress?: string;
    ipaddress?: string;
    coordinates: Coordinates = new Coordinates();
    url?: string;
    appId?: string;
    appCode?: string;
    appVersion?: string;
    appNameCode?: string;
    imeinumber?: string;
    serialNumber?: string;
    modelName?: string;
    alias?: string;
    description?: string;
    brandName?: string;
    brandDescription?: string;
}
