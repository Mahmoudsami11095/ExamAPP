import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { InfoResponse } from '../interfaces/auth-responses';

@Injectable({
    providedIn: 'root',
})
export class AuthInfoAdaptorService implements Adaptor<any, InfoResponse> {
    constructor() { }

    adapt(data: any): InfoResponse {
        return {
            message: data.message,
            info: data.info
        }
    }
}
