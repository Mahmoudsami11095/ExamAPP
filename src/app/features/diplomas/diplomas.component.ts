import { Component, inject, Signal, computed, signal, HostListener, OnInit, OnDestroy } from '@angular/core';
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
export class DiplomasComponent implements OnInit, OnDestroy {
  private diplomasService = inject(DiplomasService);
  private readonly DEFAULT_DISPLAY_COUNT = 6;
  private readonly LOAD_MORE_COUNT = 6;
  
  diplomas: Signal<Diploma[]> = toSignal(this.diplomasService.getDiplomas(), { initialValue: [] });
  displayCount = signal(this.DEFAULT_DISPLAY_COUNT);
  
  visibleDiplomas = computed(() => {
    return this.diplomas().slice(0, this.displayCount());
  });
  
  hasMoreDiplomas = computed(() => {
    return this.displayCount() < this.diplomas().length;
  });

  ngOnInit(): void {
    // Initial setup if needed
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.hasMoreDiplomas()) {
      return;
    }

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const threshold = 200; // Load more when 200px from bottom

    if (scrollPosition >= documentHeight - threshold) {
      const newCount = Math.min(
        this.displayCount() + this.LOAD_MORE_COUNT,
        this.diplomas().length
      );
      this.displayCount.set(newCount);
    }
  }
}
