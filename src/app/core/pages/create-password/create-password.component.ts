import { Component, inject, OnDestroy, input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';
import { AuthService } from 'auth';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { SubmitButtonComponent } from '../../../shared/components/UI/submit-button/submit-button.component';
import { AuthInputComponent } from '../../../shared/components/UI/auth-input/auth-input.component';
import { AuthLinkComponent } from '../../../shared/components/UI/auth-link/auth-link.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-create-password',
  standalone: true,
  imports: [ReactiveFormsModule, SubmitButtonComponent, AuthInputComponent, AuthLinkComponent],
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.css',
})
export class CreatePasswordComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  email = input<string>('');

  resetPasswordForm: FormGroup;
  isLoading = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator('newPassword', 'confirmPassword')
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

      const { newPassword } = this.resetPasswordForm.value;

      // Call API to reset password
      this.authService.resetPassword({ email: this.email(), newPassword }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: any) => {
          this.isLoading = false;

          // Check if response is an HTTP error (when catchError returns error as value)
          if (response && typeof response.status === 'number' && response.status !== 200) {
            console.log('Reset Password Failed:', response);
            return;
          }

          // Check if response indicates success
          if (response && (response.status === 'Success' || response.message === 'success')) {
            const successMsg = response.message || 'Password reset successfully!';
            this.toastr.success(successMsg, 'Success');

            // Navigate to login after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/auth/login'], { queryParams: { passwordReset: 'true' } });
            }, 2000);
          } else {
            console.log('Reset Password Failed:', response);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Reset Password error:', error);
        }
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

