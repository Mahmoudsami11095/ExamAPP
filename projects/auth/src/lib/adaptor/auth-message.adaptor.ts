import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { MessageResponse } from '../interfaces/auth-responses';

@Injectable({
    providedIn: 'root',
})
export class AuthMessageAdaptorService implements Adaptor<any, MessageResponse> {
    constructor() { }

    adapt(data: any): MessageResponse {
        return {
            message: data.message
        }
    }
}
