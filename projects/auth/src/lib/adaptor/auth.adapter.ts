import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { LoginResponse, StatusResponse, InfoResponse, MessageResponse } from '../interfaces/auth-responses';

@Injectable({
    providedIn: 'root',
})
export class AuthAdapterService {
    constructor() { }

    adaptLogin(data: LoginResponse): LoginResponse {
        return {
            message: data.message,
            token: data.token,
            email: data.email
        };
    }

    adaptStatus(data: StatusResponse): StatusResponse {
        return {
            message: data.message,
            status: data.status
        };
    }

    adaptInfo(data: InfoResponse): InfoResponse {
        return {
            message: data.message,
            info: data.info
        };
    }

    adaptMessage(data: MessageResponse): MessageResponse {
        return {
            message: data.message
        };
    }
}
