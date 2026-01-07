import { Component, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ExamsService } from './services/exams.service';
import { Exam } from './models/exam.model';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css'
})
export class ExamsComponent {
  private route = inject(ActivatedRoute);
  private examsService = inject(ExamsService);

  exams: Signal<Exam[]> = toSignal(
    this.route.queryParams.pipe(
      switchMap(params => {
        const subjectId = params['subject'];
        if (subjectId) {
          return this.examsService.getExamsBySubject(subjectId);
        }
        return of([]);
      })
    ),
    { initialValue: [] }
  );
}
