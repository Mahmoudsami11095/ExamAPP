import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface HttpErrorWithMessage extends HttpErrorResponse {
  formattedMessage?: string;
}

/**
 * Error interceptor that formats HTTP error messages based on status codes.
 * Attaches a formattedMessage property to the error object for easy access in components.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let formattedMessage = '';

      // Format error message based on status code
      if (error.status === 401) {
        formattedMessage = error.error?.message || 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.status === 400) {
        formattedMessage = error.error?.message || 'Invalid request. Please check your input and try again.';
      } else if (error.status === 409) {
        formattedMessage = error.error?.message || 'User already exists. Please try logging in.';
      } else if (error.status === 500) {
        formattedMessage = 'Server error. Please try again later.';
      } else if (error.status === 0 || !error.status) {
        formattedMessage = 'Network error. Please check your internet connection and try again.';
      } else {
        formattedMessage = error.error?.message || error.message || 'An error occurred. Please try again.';
      }

      // Attach formatted message to error object
      const errorWithMessage: HttpErrorWithMessage = {
        ...error,
        formattedMessage
      };

      return throwError(() => errorWithMessage);
    })
  );
};

