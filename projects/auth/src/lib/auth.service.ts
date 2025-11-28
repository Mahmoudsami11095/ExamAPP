import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, StatusResponse, InfoResponse, MessageResponse } from './interfaces/auth-responses';
import { AuthAPIAdaptorService } from './adaptor/auth-api.adaptor';
import { AuthStatusAdaptorService } from './adaptor/auth-status.adaptor';
import { AuthInfoAdaptorService } from './adaptor/auth-info.adaptor';
import { AuthMessageAdaptorService } from './adaptor/auth-message.adaptor';
import { AuthEndPoint } from './enums/AuthEndPoint';
import { AuthAPI } from './base/AuthAPI';
import { AUTH_BASE_URL } from './tokens/auth-base-url.token';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements AuthAPI {

  _httpClient = inject(HttpClient);
  _authAPIAdaptorService = inject(AuthAPIAdaptorService);
  _authStatusAdaptorService = inject(AuthStatusAdaptorService);
  _authInfoAdaptorService = inject(AuthInfoAdaptorService);
  _authMessageAdaptorService = inject(AuthMessageAdaptorService);
  private readonly baseUrl = inject(AUTH_BASE_URL);

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  register(data: any): Observable<LoginResponse> {
    return this._httpClient.post(this.getUrl(AuthEndPoint.REGISTER), data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response))
      );
  }

  login(data: any): Observable<LoginResponse> {
    return this._httpClient.post(this.getUrl(AuthEndPoint.LOGIN), data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response))
      );
  }

  forgotPassword(data: any): Observable<InfoResponse> {
    return this._httpClient.post(this.getUrl(AuthEndPoint.FORGOTPASSWORD), data)
      .pipe(
        map((response: any) => this._authInfoAdaptorService.adapt(response))
      );
  }

  verifyResetCode(data: any): Observable<StatusResponse> {
    return this._httpClient.post(this.getUrl(AuthEndPoint.VERIFYRESETCODE), data)
      .pipe(
        map((response: any) => this._authStatusAdaptorService.adapt(response))
      );
  }

  resetPassword(data: any): Observable<MessageResponse> {
    return this._httpClient.put(this.getUrl(AuthEndPoint.RESETPASSWORD), data)
      .pipe(
        map((response: any) => this._authMessageAdaptorService.adapt(response))
      );
  }

}
