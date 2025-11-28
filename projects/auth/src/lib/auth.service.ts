import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthAPIAdaptorService } from './adaptor/auth-api.adaptor';
import { AuthEndPoint } from './enums/AuthEndPoint';
import { AuthAPI } from './base/AuthAPI';
import { AUTH_BASE_URL } from './tokens/auth-base-url.token';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements AuthAPI {

  _httpClient = inject(HttpClient);
  _authAPIAdaptorService = inject(AuthAPIAdaptorService);
  private readonly baseUrl = inject(AUTH_BASE_URL);

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
  
  register(data: any): Observable<any> {
    return this._httpClient.post(this.getUrl(AuthEndPoint.REGISTER), data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response)),
        catchError(err => of(err))
      );
  }

  login(data: any): Observable<any> {
    return this._httpClient.post(this.getUrl(AuthEndPoint.LOGIN), data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response)),
        catchError(err => of(err))
      );
  }

  forgotPassword(data: any): Observable<any> {
    return this._httpClient.post(this.getUrl(AuthEndPoint.FORGOTPASSWORD), data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response)),
        catchError(err => of(err))
      );
  }

  verifyResetCode(data: any): Observable<any> {
    return this._httpClient.post(this.getUrl(AuthEndPoint.VERIFYRESETCODE), data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response)),
        catchError(err => of(err))
      );
  }

  resetPassword(data: any): Observable<any> {
    return this._httpClient.put(this.getUrl(AuthEndPoint.RESETPASSWORD), data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response)),
        catchError(err => of(err))
      );
  }
  
}
