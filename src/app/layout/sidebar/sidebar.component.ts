import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, UserInfoResponse } from 'auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  _authService = inject(AuthService);
  _router = inject(Router);
  user = signal<UserInfoResponse['user'] | null>(null);
  isDropdownOpen = signal(false);

  firstName = computed(() => this.user()?.firstName ?? '');
  lastName = computed(() => this.user()?.lastName ?? '');
  email = computed(() => this.user()?.email ?? '');
  // profileImage = computed(() => this.user()?._id ? `https://i.pravatar.cc/150?u=${this.user()?._id}` : '');
  profileImage = computed(() => ''); // Placeholder until real image field is known
  initials = computed(() => {
    const f = this.firstName().charAt(0).toUpperCase();
    const l = this.lastName().charAt(0).toUpperCase();
    return `${f}${l}`;
  });

  ngOnInit(): void {
    this._authService.getLoggedUserInfo().subscribe({
      next: (response) => {
        this.user.set(response.user);
      },
      error: (err) => console.error(err)
    });
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/auth/login']);
  }
}
