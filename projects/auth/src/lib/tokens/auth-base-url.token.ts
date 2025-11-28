import { InjectionToken } from '@angular/core';

export const AUTH_BASE_URL = new InjectionToken<string>('AUTH_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://exam.elevateegy.com/api/v1'
});

