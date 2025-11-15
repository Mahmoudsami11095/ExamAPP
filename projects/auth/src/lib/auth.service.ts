import { Injectable, inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthAPIAdaptorService } from './adaptor/auth-api.adaptor';
import { AuthEndPoint } from './enums/AuthEndPoint';
import { AuthAPI } from './base/AuthAPI';

@Injectable({
  providedIn: 'root',
})

export class AuthService implements AuthAPI {

  _httpClient = inject(HttpClient);
  _authAPIAdaptorService = inject(AuthAPIAdaptorService);
  
  register(data: any): Observable<any> {
    return this._httpClient.post(AuthEndPoint.REGISTER, data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response)),
        catchError(err => of(err))
      );
  }

  login(data: any): Observable<any> {
    return this._httpClient.post(AuthEndPoint.LOGIN, data)
      .pipe(
        map((response: any) => this._authAPIAdaptorService.adapt(response)),
        catchError(err => of(err))
      );
  }
  
}
