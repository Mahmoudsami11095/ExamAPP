import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthPromo } from '../../../shared/components/UI/auth-promo/auth-promo';
import { AuthService } from 'auth';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthPromo],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  otpForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  email = 'user@example.com';
  timer = 60;
  timerInterval: any;
  canResend = false;

  constructor() {
    // Create form with 6 OTP fields dynamically
    const otpControls: { [key: string]: any } = {};
    for (let i = 1; i <= 6; i++) {
      otpControls[`otp${i}`] = ['', [Validators.required, Validators.pattern(/^[0-9]$/)]];
    }
    this.otpForm = this.fb.group(otpControls);
  }

  ngOnInit() {
    // Get email from query params if available
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });

    // Start timer
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.timer = 60;
    this.canResend = false;
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.canResend = true;
      }
    }, 1000);
  }

  getOtpValue(): string {
    const values: string[] = [];
    for (let i = 1; i <= 6; i++) {
      values.push(this.otpForm.get(`otp${i}`)?.value || '');
    }
    return values.join('');
  }

  onInput(event: any, currentIndex: number) {
    const input = event.target;
    const value = input.value;

    // Only allow single digit
    if (value.length > 1) {
      input.value = value.charAt(0);
      this.otpForm.get(`otp${currentIndex + 1}`)?.setValue(value.charAt(0));
    }

    // Move to next input if value is entered
    if (value && currentIndex < 5) {
      const nextInput = document.getElementById(`otp${currentIndex + 2}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, currentIndex: number) {
    // Handle backspace
    const target = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && target && !target.value && currentIndex > 0) {
      const prevInput = document.getElementById(`otp${currentIndex}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').trim();
    
    if (pastedData && /^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      digits.forEach((digit, index) => {
        if (index < 6) {
          this.otpForm.get(`otp${index + 1}`)?.setValue(digit);
        }
      });
      // Focus last input
      const lastInput = document.getElementById('otp6');
      if (lastInput) {
        lastInput.focus();
      }
    }
  }

  resendCode() {
    if (this.canResend) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Resend OTP by calling forgot password API again
      this.authService.forgotPassword({ email: this.email }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          if (response && response.message === 'success') {
            // Restart timer
            this.startTimer();
            this.errorMessage = '';
          } else {
            this.errorMessage = response?.message || response?.info || 'Failed to resend OTP. Please try again.';
          }
        },
        error: (error: any) => {
          this.isLoading = false;  
          console.error('Resend OTP error:', error);
        }
      });
    }
  }

  editEmail() {
    // Navigate back to forgot password page
    this.router.navigate(['/auth/forgot-password'], { queryParams: { email: this.email } });
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const otpCode = this.getOtpValue();

      // Verify OTP with backend
      this.authService.verifyResetCode({ resetCode: otpCode }).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          // Check if response indicates success (API returns { "status": "Success" })
          if (response && (response.status === 'Success' || response.message === 'success')) {
            // Navigate to reset password page
            this.router.navigate(['/auth/create-password'], { queryParams: { email: this.email } });
            return;
          }
          
          // Check if response is an HTTP error (when catchError returns error as value)
          if (response && typeof response.status === 'number' && response.status !== 200) {
            this.errorMessage = response.error?.message || response.message || 'Invalid OTP code. Please try again.';
            this.otpForm.reset();
            console.log('Verify OTP Failed:', response);
            return;
          }
          
          // Response without success message or error status
          this.errorMessage = response?.message || response?.status || 'Invalid OTP code. Please try again.';
          // Clear form
          this.otpForm.reset();
          console.log('Verify OTP Failed:', response);
        },
        error: (error: any) => {
          this.isLoading = false;    
          // Clear form on error
          this.otpForm.reset();
          console.error('Verify OTP error:', error);
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/auth/forgot-password']);
  }
}

