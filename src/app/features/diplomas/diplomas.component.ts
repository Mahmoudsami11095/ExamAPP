import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DiplomasService } from './services/diplomas.service';
import { Diploma } from './models/diploma.model';

@Component({
  selector: 'app-diplomas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './diplomas.component.html',
  styleUrl: './diplomas.component.css'
})
export class DiplomasComponent {
  private diplomasService = inject(DiplomasService);
  diplomas: Signal<Diploma[]> = toSignal(this.diplomasService.getDiplomas(), { initialValue: [] });
}
