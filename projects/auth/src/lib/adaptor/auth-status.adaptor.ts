import { Injectable } from '@angular/core';
import { Adaptor } from '../interfaces/adaptor';
import { StatusResponse } from '../interfaces/auth-responses';

@Injectable({
  providedIn: 'root',
})
export class AuthStatusAdaptorService implements Adaptor<StatusResponse, StatusResponse> {
  constructor() { }

  adapt(data: StatusResponse): StatusResponse {
    return {
      message: data.message,
      status: data.status
    }
  }
}
