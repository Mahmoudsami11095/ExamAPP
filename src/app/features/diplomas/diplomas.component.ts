import { Component, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DiplomasService } from './services/diplomas.service';
import { Diploma } from './models/diploma.model';

@Component({
  selector: 'app-diplomas',
  standalone: true,
  templateUrl: './diplomas.component.html',
  styleUrl: './diplomas.component.css'
})
export class DiplomasComponent {
  private diplomasService = inject(DiplomasService);
  diplomas: Signal<Diploma[]> = toSignal(this.diplomasService.getDiplomas(), { initialValue: [] });
}
