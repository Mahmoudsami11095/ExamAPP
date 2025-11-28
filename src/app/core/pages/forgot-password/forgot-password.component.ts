import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';
import { AuthService } from 'auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthPromo],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  forgotPasswordForm: FormGroup;
  isLoading = false;
  isEmailSent = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email(): AbstractControl | null {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { email } = this.forgotPasswordForm.value;

      this.authService.forgotPassword({ email }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          // Check if response is an error 
          if (response && response.status && response.status !== 200) {
            // This is an error response
            this.isEmailSent = false;
            this.successMessage = '';
            this.errorMessage = response.error?.message || response.message ;
            console.log('Forgot Password Failed:', response);
            return;
          }
          
          // Check if response indicates success
          if (response && response.message === 'success') {
            this.isEmailSent = true;
            this.successMessage = response.info || 'OTP sent to your email';
            this.errorMessage = '';
            console.log('OTP sent to your email', response);
            // Automatically navigate to verify OTP page
            this.navigateToVerifyOtp();
          } else {
            // Response without success message (might be an error message)
            this.errorMessage = response?.message || response?.info || 'Failed to send OTP. Please try again.';
            this.successMessage = '';
            this.isEmailSent = false;
            console.log('Forgot Password Failed:', response);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.isEmailSent = false;
          
          
          this.successMessage = '';
          console.error('Forgot Password error:', error);
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }


  navigateToVerifyOtp() {
    const email = this.forgotPasswordForm.get('email')?.value;
    if (email) {
      this.router.navigate(['/auth/verify-otp'], { queryParams: { email } });
    }
  }
}

