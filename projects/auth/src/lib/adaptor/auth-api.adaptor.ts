import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { LoginResponse } from '../interfaces/auth-responses';

@Injectable({
  providedIn: 'root',
})
export class AuthAPIAdaptorService implements Adaptor<any, LoginResponse> {
  constructor() { }

  adapt(data: any): LoginResponse {
    return {
      message: data.message,
      token: data.token,
      email: data.email
    }
  }
}
