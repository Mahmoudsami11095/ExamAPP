import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthPromo } from '../../../shared/components/UI/auth-promo/auth-promo';
import { AuthService } from 'auth';

@Component({
  selector: 'app-login',
  imports: [AuthPromo, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  _authService = inject(AuthService);
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  
  login(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      this._authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          // Check if response has a token (successful login)
          if (response && response.token) {
            this.successMessage = (response.message.toUpperCase() + response.message) || 'Login successful!';
            this.errorMessage = '';
            // TODO: Store token and redirect user
            console.log('Login successful:', response);
          } else {
            // Response without token (error from server)
            this.errorMessage = response?.message || 'Login failed. Please try again.';
            this.successMessage = '';
            console.log('Login Failed:', response);

          }
        },
        error: (error) => {
          this.isLoading = false;
          
          // Handle HTTP errors
          if (error.status === 401) {
            this.errorMessage = error.error?.message || 'Invalid email or password. Please check your credentials and try again.';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Invalid request. Please check your input and try again.';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else if (error.status === 0 || !error.status) {
            this.errorMessage = 'Network error. Please check your internet connection and try again.';
          } else {
            this.errorMessage = error.error?.message || error.message || 'An error occurred. Please try again.';
          }
          
          this.successMessage = '';
          console.error('Login error:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
