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
      
      this._authService.login(this.loginForm.value).subscribe(res => {
        console.log( res);
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
