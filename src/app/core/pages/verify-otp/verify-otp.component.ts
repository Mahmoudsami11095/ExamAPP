import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef, QueryList, inject, Output, EventEmitter, input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';
import { AuthService } from 'auth';
import { SubmitButtonComponent } from '../../../shared/components/UI/submit-button/submit-button.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SubmitButtonComponent],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit, OnDestroy, AfterViewInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private destroy$ = new Subject<void>();

  email = input<string>('');
  @Output() verified = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  otpForm: FormGroup;
  isLoading = false;
  timer = 60;
  timerInterval: any;
  canResend = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor() {
    // Create form with 6 OTP fields dynamically
    const otpControls: { [key: string]: any } = {};
    for (let i = 1; i <= 6; i++) {
      otpControls[`otp${i}`] = ['', [Validators.required, Validators.maxLength(1), Validators.pattern(/^[0-9]$/)]];
    }
    this.otpForm = this.fb.group(otpControls);
  }

  ngAfterViewInit(): void {
    // Optionally focus the first OTP input when the view is initialized
    this.focusInput(0);
  }

  ngOnInit() {
    // Start timer
    this.startTimer();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  private focusInput(index: number): void {
    const inputRef = this.otpInputs?.get(index);
    inputRef?.nativeElement.focus();
  }

  onInput(event: any, currentIndex: number) {
    const input = event.target;
    const value = input.value;

    // Move to next input if value is entered
    if (value && currentIndex < 5) {
      this.focusInput(currentIndex + 1);
    }
  }

  onKeyDown(event: KeyboardEvent, currentIndex: number) {
    // Handle backspace
    const target = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && target && !target.value && currentIndex > 0) {
      this.focusInput(currentIndex - 1);
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
      this.focusInput(this.otpInputs.length - 1);
    }
  }

  resendCode() {
    if (this.canResend) {
      this.isLoading = true;

      // Resend OTP by calling forgot password API again
      this.authService.forgotPassword({ email: this.email() }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: any) => {
          this.isLoading = false;

          if (response && response.message === 'success') {
            // Restart timer
            this.startTimer();
            this.toastr.success('OTP resent successfully', 'Success');
          } else {
            const errorMsg = response?.message || response?.info || 'Failed to resend OTP. Please try again.';
            this.toastr.error(errorMsg, 'Error');
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          const errorMsg = error.formattedMessage || 'An error occurred. Please try again.';
          this.toastr.error(errorMsg, 'Error');
          console.error('Resend OTP error:', error);
        }
      });
    }
  }

  editEmail() {
    this.back.emit();
  }

  onSubmit() {
    if (this.otpForm.valid) {
      this.isLoading = true;

      const otpCode = this.getOtpValue();

      // Verify OTP with backend
      this.authService.verifyResetCode({ resetCode: otpCode }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: any) => {
          this.isLoading = false;

          // Check if response indicates success (API returns { "status": "Success" })
          if (response && (response.status === 'Success' || response.message === 'success')) {
            this.toastr.success('OTP verified successfully', 'Success');
            this.verified.emit();
            return;
          }

          // Check if response is an HTTP error (when catchError returns error as value)
          if (response && typeof response.status === 'number' && response.status !== 200) {
            const errorMsg = response.error?.message || response.message || 'Invalid OTP code. Please try again.';
            this.toastr.error(errorMsg, 'Error');
            this.otpForm.reset();
            console.log('Verify OTP Failed:', response);
            return;
          }

          // Response without success message or error status
          const errorMsg = response?.message || response?.status || 'Invalid OTP code. Please try again.';
          this.toastr.error(errorMsg, 'Error');
          // Clear form
          this.otpForm.reset();
          console.log('Verify OTP Failed:', response);
        },
        error: (error: any) => {
          this.isLoading = false;
          const errorMsg = error.error?.message || error.message || 'An error occurred. Please try again.';
          this.toastr.error(errorMsg, 'Error');
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
    this.back.emit();
  }
}

