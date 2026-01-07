import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuizStore } from './store/quiz.store';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
  providers: [QuizStore]
})
export class QuestionsComponent implements OnInit, OnDestroy {
  store = inject(QuizStore);
  private route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      // Auto-submit when time is up (handled here since we can't easily call sibling methods in store)
      // Or simpler: The store handles the basic countdown, and we just watch for 0 here to trigger submit?
      // Actually, let's trust the logic we put in store (wait, I didn't put auto-submit in store yet).
      // Let's add an effect here to watch timeLeft
      if (this.store.timeLeft() === 0 && this.store.questions().length > 0 && !this.store.isSubmitted()) {
        // this.store.submitQuiz(); // We can call this
        // But wait, initially it is 0.
        if (this.store.totalTime() > 0) { // Ensure it was started
          this.store.submitQuiz();
        }
      }
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.loadExamData(id);
      }
    });
  }

  ngOnDestroy() {
    this.store.stopTimer();
  }
}
