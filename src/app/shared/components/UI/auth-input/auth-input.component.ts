import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-auth-input',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './auth-input.component.html',
    styleUrl: './auth-input.component.css'
})
export class AuthInputComponent {
    control = input.required<FormControl | AbstractControl>();
    label = input.required<string>();
    type = input<string>('text');
    placeholder = input<string>('');
    id = input.required<string>();
}
