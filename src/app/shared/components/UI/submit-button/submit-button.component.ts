import { Component, input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css',
})
export class SubmitButtonComponent {
  buttonText = input<string>('Submit');
  loadingText = input<string>('Loading...');
  isLoading = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<'submit' | 'button' | 'reset'>('submit');
  additionalClasses = input<string>('');
}

