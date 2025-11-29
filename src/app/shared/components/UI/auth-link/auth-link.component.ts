import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-auth-link',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './auth-link.component.html',
    styleUrl: './auth-link.component.css'
})
export class AuthLinkComponent {
    text = input.required<string>();
    linkText = input.required<string>();
    linkRoute = input.required<string | any[]>();
}
