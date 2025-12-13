import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from 'auth';

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
  user = signal<any>(null);
  isDropdownOpen = signal(false);

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
