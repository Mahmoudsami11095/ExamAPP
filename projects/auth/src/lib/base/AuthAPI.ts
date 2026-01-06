import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, ForgotPasswordRequest, VerifyResetCodeRequest, ResetPasswordRequest } from '../interfaces/auth-requests';
import { LoginResponse, StatusResponse, InfoResponse, MessageResponse } from '../interfaces/auth-responses';

export abstract class AuthAPI {
  abstract register(data: RegisterRequest): Observable<LoginResponse>;
  abstract login(data: LoginRequest): Observable<LoginResponse>;
  abstract forgotPassword(data: ForgotPasswordRequest): Observable<InfoResponse>;
  abstract verifyResetCode(data: VerifyResetCodeRequest): Observable<StatusResponse>;
  abstract resetPassword(data: ResetPasswordRequest): Observable<MessageResponse>;
  //abstract changePassword(data: any): Observable<any>;
  //abstract deleteMyAccount(data: any): Observable<any>;
  //abstract editProfile(data: any): Observable<any>;
  //abstract logout(data: any): Observable<any>;
  //abstract getLoggedUserInfo(data: any): Observable<any>;
}