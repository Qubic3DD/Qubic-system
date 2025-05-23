import { BaseRequest } from "./base-request";

export class AdvertisersRequest extends BaseRequest {
  token: string;
  data: any;
  message: string;

  constructor(token: string = "", data: any = {}, message: string = "") {
    super();
    this.token = token;
    this.data = data;
    this.message = message;
  }
}