import { Component, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'auth';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';
import { SubmitButtonComponent } from '../../../shared/components/UI/submit-button/submit-button.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthPromo, SubmitButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: passwordMatchValidator('password', 'confirmPassword')
  });

  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  selectedCountryCode = 'EG';
  countryCode = '+20';
  phoneNumber = '';

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const { firstName, lastName, username, email, phone, password, confirmPassword } = this.registerForm.value;

      const registerData = {
        username,
        firstName,
        lastName,
        email,
        password,
        rePassword: confirmPassword,
        phone
      };

      this.authService.register(registerData).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          // Check if response has a token (successful registration)
          if (response && response.token) {
            const successMsg = response.message || 'Registration successful! Redirecting to login...';
            this.toastr.success(successMsg, 'Success');
            // TODO: Store token if needed
            console.log('Registration successful:', response);
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
              this.router.navigate(['/auth/login'], { queryParams: { registered: 'true' } });
            }, 2000);
          } else {
            // Response without token (error from server)
            const errorMsg = response?.message || 'Registration failed. Please try again.';
            this.toastr.error(errorMsg, 'Error');
            console.log('Registration Failed:', response);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          const errorMsg = error.formattedMessage || 'An error occurred. Please try again.';
          this.toastr.error(errorMsg, 'Error');
          console.error('Registration error:', error);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

