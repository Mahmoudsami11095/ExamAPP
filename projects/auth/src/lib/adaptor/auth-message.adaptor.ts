import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { MessageResponse } from '../interfaces/auth-responses';

@Injectable({
    providedIn: 'root',
})
export class AuthMessageAdaptorService implements Adaptor<MessageResponse, MessageResponse> {
    constructor() { }

    adapt(data: MessageResponse): MessageResponse {
        return {
            message: data.message
        }
    }
}
