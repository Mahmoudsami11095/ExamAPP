import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';
import { AuthService } from 'auth';
import { SubmitButtonComponent } from '../../../shared/components/UI/submit-button/submit-button.component';

@Component({
  selector: 'app-login',
  imports: [AuthPromo, ReactiveFormsModule, RouterLink, SubmitButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  _authService = inject(AuthService);
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  ngOnInit() {
    // Check if user was redirected after password reset
    this.route.queryParams.subscribe(params => {
      if (params['passwordReset'] === 'true') {
        this.successMessage = 'Password reset successfully! Please login with your new password.';
      }
    });
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
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.formattedMessage || 'An error occurred. Please try again.';
          this.successMessage = '';
          console.error('Login error:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
