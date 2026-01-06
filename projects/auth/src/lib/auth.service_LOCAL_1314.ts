import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, StatusResponse, InfoResponse, MessageResponse, UserInfoResponse } from './interfaces/auth-responses';
import { LoginRequest, RegisterRequest, ForgotPasswordRequest, VerifyResetCodeRequest, ResetPasswordRequest, ChangePasswordRequest, EditProfileRequest } from './interfaces/auth-requests';
import { AuthAdapterService } from './adaptor/auth.adapter';
import { AuthEndPoint } from './enums/AuthEndPoint';
import { AuthAPI } from './base/AuthAPI';
import { AUTH_BASE_URL } from './tokens/auth-base-url.token';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements AuthAPI {

  _httpClient = inject(HttpClient);
  _authAdapterService = inject(AuthAdapterService);
  private readonly baseUrl = inject(AUTH_BASE_URL);

  private getUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this._httpClient.post<LoginResponse>(this.getUrl(AuthEndPoint.REGISTER), data)
      .pipe(
        map((response) => this._authAdapterService.adaptLogin(response))
      );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this._httpClient.post<LoginResponse>(this.getUrl(AuthEndPoint.LOGIN), data)
      .pipe(
        map((response) => this._authAdapterService.adaptLogin(response))
      );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<InfoResponse> {
    return this._httpClient.post<InfoResponse>(this.getUrl(AuthEndPoint.FORGOTPASSWORD), data)
      .pipe(
        map((response) => this._authAdapterService.adaptInfo(response))
      );
  }

  verifyResetCode(data: VerifyResetCodeRequest): Observable<StatusResponse> {
    return this._httpClient.post<StatusResponse>(this.getUrl(AuthEndPoint.VERIFYRESETCODE), data)
      .pipe(
        map((response) => this._authAdapterService.adaptStatus(response))
      );
  }

  resetPassword(data: ResetPasswordRequest): Observable<MessageResponse> {
    return this._httpClient.put<MessageResponse>(this.getUrl(AuthEndPoint.RESETPASSWORD), data)
      .pipe(
        map((response) => this._authAdapterService.adaptMessage(response))
      );
  }

  changePassword(data: ChangePasswordRequest): Observable<MessageResponse> {
    return this._httpClient.patch<MessageResponse>(this.getUrl(AuthEndPoint.CHANGEPASSWORD), data)
      .pipe(
        map((response) => this._authMessageAdaptorService.adapt(response))
      );
  }

  deleteAccount(): Observable<MessageResponse> {
    return this._httpClient.delete<MessageResponse>(this.getUrl(AuthEndPoint.DELETEMYACCOUNT))
      .pipe(
        map((response) => this._authMessageAdaptorService.adapt(response))
      );
  }

  editProfile(data: EditProfileRequest): Observable<UserInfoResponse> {
    return this._httpClient.put<UserInfoResponse>(this.getUrl(AuthEndPoint.EDITPROFILE), data)
      .pipe(
        map((response) => response)
      );
  }

  getLoggedUserInfo(): Observable<UserInfoResponse> {
    return this._httpClient.get<UserInfoResponse>(this.getUrl(AuthEndPoint.GETLOGGEDUSERINFO))
      .pipe(
        map((response) => response)
      );
  }

}
