import { RegisterRequest } from "../Requests/register-request";
import { RegisterResponse } from "../Response/register-response";
import { Mapper } from "./mapper";

export class RegisterMapper implements Mapper<RegisterRequest,RegisterResponse> {
    mapFrom(param: RegisterRequest): RegisterResponse {
        throw new Error("Method not implemented.");
    }
    mapTo(param: RegisterResponse): RegisterRequest {
        throw new Error("Method not implemented.");
    }
}
