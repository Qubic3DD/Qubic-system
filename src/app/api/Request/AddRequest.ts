import { BaseRequest } from "./base-request";

export class AddRequest extends BaseRequest {
  userName!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  phoneNo!: string;
  userHandle!: string;
  roles!: string[];
  companyName?: string;

}