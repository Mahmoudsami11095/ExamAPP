import { Component, inject, OnInit, signal, effect, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, ChangePasswordRequest, EditProfileRequest } from 'auth';
import { ToastrService } from 'ngx-toastr';
import { AuthInputComponent } from '../../shared/components/UI/auth-input/auth-input.component';
import { SubmitButtonComponent } from '../../shared/components/UI/submit-button/submit-button.component';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, CommonModule, AuthInputComponent, SubmitButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  getControl(form: FormGroup, controlName: string): FormControl {
    return form.get(controlName) as FormControl;
  }
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  activeTab: WritableSignal<'profile' | 'password'> = signal('profile');
  showDeleteModal = signal(false);
  isLoading = signal(false);
  userData = signal<any>(null);

  profileForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]]
  });

  passwordForm: FormGroup = this.fb.group({
    password: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    rePassword: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      const user = this.userData();
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        });
      }
    });
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo() {
    this.authService.getLoggedUserInfo().subscribe({
      next: (res) => {
        this.userData.set(res.user);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const data: EditProfileRequest = this.profileForm.getRawValue();
    this.authService.editProfile(data).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastr.success('Profile updated successfully');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error('Failed to update profile');
        console.error(err);
      }
    });
  }

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.rePassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    this.isLoading.set(true);
    const data: ChangePasswordRequest = {
      oldPassword: this.passwordForm.value.password,
      password: this.passwordForm.value.newPassword,
      rePassword: this.passwordForm.value.rePassword
    };

    this.authService.changePassword(data).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastr.success('Password updated successfully. Please login again.');
        this.passwordForm.reset();
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error(err.error?.message || 'Failed to update password');
      }
    });
  }

  deleteAccount() {
    this.isLoading.set(true);
    this.authService.deleteAccount().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.toastr.success('Account deleted');
        localStorage.removeItem('token');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toastr.error('Failed to delete account');
      }
    });
  }
}
