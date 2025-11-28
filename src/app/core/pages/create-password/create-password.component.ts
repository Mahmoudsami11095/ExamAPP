import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';
import { AuthService } from 'auth';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-create-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthPromo],
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.css',
})
export class CreatePasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  resetPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showNewPassword = false;
  showConfirmPassword = false;
  email = '';

  constructor() {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator('newPassword', 'confirmPassword')
    });

    // Get email from query params
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  get newPassword(): AbstractControl | null {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword(): AbstractControl | null {
    return this.resetPasswordForm.get('confirmPassword');
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { newPassword } = this.resetPasswordForm.value;

      // Call API to reset password
      this.authService.resetPassword({ email: this.email, newPassword }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          // Check if response is an HTTP error (when catchError returns error as value)
          if (response && typeof response.status === 'number' && response.status !== 200) {
            this.errorMessage = response.error?.message || response.message || 'Failed to reset password. Please try again.';
            this.successMessage = '';
            console.log('Reset Password Failed:', response);
            return;
          }
          
          // Check if response indicates success
          if (response && (response.status === 'Success' || response.message === 'success')) {
            this.successMessage = response.message || 'Password reset successfully!';
            this.errorMessage = '';
            
            // Navigate to login after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/auth/login'], { queryParams: { passwordReset: 'true' } });
            }, 2000);
          } else {
            this.errorMessage = response?.message || 'Failed to reset password. Please try again.';
            this.successMessage = '';
            console.log('Reset Password Failed:', response);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.successMessage = '';
          console.error('Reset Password error:', error);
        }
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}

