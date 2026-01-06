import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthPromo } from '../auth-promo/auth-promo';
import { AuthService } from 'auth';
import { SubmitButtonComponent } from '../../../../shared/components/UI/submit-button/submit-button.component';
import { AuthInputComponent } from '../../../../shared/components/UI/auth-input/auth-input.component';
import { AuthLinkComponent } from '../../../../shared/components/UI/auth-link/auth-link.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';
import { CreatePasswordComponent } from '../create-password/create-password.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, SubmitButtonComponent, VerifyOtpComponent, CreatePasswordComponent, AuthInputComponent, AuthLinkComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  forgotPasswordForm: FormGroup;
  isLoading = false;

  // State management using Signals
  step = signal<number>(1);
  email = signal<string>('');

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl(): AbstractControl | null {
    return this.forgotPasswordForm.get('email');
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;

      const { email } = this.forgotPasswordForm.value;
      this.email.set(email);

      this.authService.forgotPassword({ email }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: any) => {
          this.isLoading = false;

          // Check if response is an error 
          if (response && response.status && response.status !== 200) {
            // This is an error response
            console.log('Forgot Password Failed:', response);
            return;
          }

          // Check if response indicates success
          if (response && response.message === 'success') {
            const successMsg = response.info || 'OTP sent to your email';
            this.toastr.success(successMsg, 'Success');
            console.log('OTP sent to your email', response);
            // Advance to next step
            this.step.set(2);
          } else {
            // Response without success message (might be an error message)
            console.log('Forgot Password Failed:', response);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Forgot Password error:', error);
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  onOtpVerified() {
    this.step.set(3);
  }

  onBack() {
    this.step.set(1);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

