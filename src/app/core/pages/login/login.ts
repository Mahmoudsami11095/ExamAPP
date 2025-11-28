import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';
import { AuthService } from 'auth';
import { SubmitButtonComponent } from '../../../shared/components/UI/submit-button/submit-button.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [AuthPromo, ReactiveFormsModule, RouterLink, SubmitButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  _authService = inject(AuthService);
  isLoading = false;
  showPassword = false;

  ngOnInit() {
    // Check if user was redirected after password reset
    this.route.queryParams.subscribe(params => {
      if (params['passwordReset'] === 'true') {
        this.toastr.success('Password reset successfully! Please login with your new password.', 'Success');
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
      
      this._authService.login(this.loginForm.value).subscribe({
        next: (response) => {
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
        error: (error: any) => {
          this.isLoading = false;
          const errorMsg = error.formattedMessage || 'An error occurred. Please try again.';
          this.toastr.error(errorMsg, 'Error');
          console.error('Login error:', error);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
