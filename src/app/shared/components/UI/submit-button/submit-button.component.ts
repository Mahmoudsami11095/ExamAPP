import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  standalone: true,
  imports: [],
  templateUrl: './submit-button.component.html',
  styleUrl: './submit-button.component.css',
})
export class SubmitButtonComponent {
  @Input() buttonText: string = 'Submit';
  @Input() loadingText: string = 'Loading...';
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: 'submit' | 'button' | 'reset' = 'submit';
  @Input() additionalClasses: string = '';
}

