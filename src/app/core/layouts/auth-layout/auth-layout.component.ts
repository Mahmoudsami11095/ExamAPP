import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthPromo } from '../../../features/auth/components/auth-promo/auth-promo';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [RouterOutlet, AuthPromo],
    templateUrl: './auth-layout.component.html',
    styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
