import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';
import { AuthService, LoginRequest, LoginResponse } from 'auth';
import { SubmitButtonComponent } from '../../../shared/components/UI/submit-button/submit-button.component';
import { AuthInputComponent } from '../../../shared/components/UI/auth-input/auth-input.component';
import { AuthLinkComponent } from '../../../shared/components/UI/auth-link/auth-link.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, SubmitButtonComponent, AuthInputComponent, AuthLinkComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  _authService = inject(AuthService);
  isLoading = false;
  showPassword = false;

  ngOnInit() {
    // Check if user was redirected after password reset
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['passwordReset'] === 'true') {
        this.toastr.success('Password reset successfully! Please login with your new password.', 'Success');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  login(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const loginData: LoginRequest = this.loginForm.value as LoginRequest;

      this._authService.login(loginData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: LoginResponse) => {
          this.isLoading = false;

          // Check if response has a token (successful login)
          if (response && response.token) {
            const successMsg = (response.message.toUpperCase() + response.message) || 'Login successful!';
            this.toastr.success(successMsg, 'Success');
            // TODO: Store token and redirect user
            console.log('Login successful:', response);
          } else {
            // Response without token (error from server)
            const errorMsg = response?.message || 'Login failed. Please try again.';
            this.toastr.error(errorMsg, 'Error');
            console.log('Login Failed:', response);

          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          const errorMsg = error.error?.message || error.message || 'An error occurred. Please try again.';
          this.toastr.error(errorMsg, 'Error');
          console.error('Login error:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
