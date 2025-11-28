import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { StatusResponse } from '../interfaces/auth-responses';

@Injectable({
  providedIn: 'root',
})
export class AuthStatusAdaptorService implements Adaptor<any, StatusResponse> {
  constructor() { }

  adapt(data: any): StatusResponse {
    return {
      message: data.message,
      status: data.status
    }
  }
}
