import { Component, inject, Signal, OnDestroy, effect, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { QuestionsService } from './services/questions.service';
import { ExamsService } from '../exams/services/exams.service';
import { Question, QuizResult } from './models/question.model';
import { Exam } from '../exams/models/exam.model';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private questionsService = inject(QuestionsService);
  private examsService = inject(ExamsService);
  private toastr = inject(ToastrService);

  private subscription: Subscription = new Subscription();
  private timerInterval: ReturnType<typeof setInterval> | undefined;
  private timerStarted = false;

  private paramMap = toSignal(this.route.paramMap);
  examId = computed(() => this.paramMap()?.get('id'));

  questions: Signal<Question[]> = toSignal(
    toObservable(this.examId).pipe(
      switchMap(id => {
        if (id) {
          return this.questionsService.getQuestionsByExam(id);
        }
        return of([]);
      })
    ),
    { initialValue: [] }
  );

  exam: Signal<Exam | undefined> = toSignal(
    toObservable(this.examId).pipe(
      switchMap(id => {
        if (id) {
          return this.examsService.getExamById(id);
        }
        return of(undefined);
      })
    )
  );

  // State Signals
  currentQuestionIndex = signal(0);
  selectedOption = signal<string | null>(null);
  timeLeft = signal(0);
  totalTime = signal(0);
  isSubmitted = signal(false);
  quizResult = signal<QuizResult | null>(null);

  // Track user answers
  userAnswers = signal(new Map<string, string>());

  // Computed Signals
  timer = computed(() => {
    const seconds = this.timeLeft();
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  });

  timerProgressOffset = computed(() => {
    const circumference = 176;
    const total = this.totalTime();
    const current = this.timeLeft();
    if (total === 0) return 0;
    return circumference * (1 - current / total);
  });

  resultChartStyle = computed(() => {
    const total = this.questions().length;
    const result = this.quizResult();
    if (total === 0 || !result) return {};
    const correct = result.correct;
    const percent = (correct / total) * 100;
    return {
      '--chart-percent': `${percent}%`
    };
  });

  correctCount = computed(() => {
    const result = this.quizResult();
    if (!result) return 0;
    return result.correct;
  });

  incorrectCount = computed(() => {
    const result = this.quizResult();
    if (!result) return 0;
    return this.questions().length - result.correct;
  });

  constructor() {
    effect(() => {
      const examData = this.exam();
      const questionsList = this.questions();
      // Start timer when data is ready
      if (!this.timerStarted && examData && examData.duration && questionsList.length > 0) {
        this.startTimer(examData.duration);
        this.timerStarted = true;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(durationMinutes: number) {
    const totalSeconds = durationMinutes * 60;
    this.totalTime.set(totalSeconds);
    this.timeLeft.set(totalSeconds);

    this.timerInterval = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      } else {
        this.submitQuiz();
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  pad(val: number): string {
    return val < 10 ? `0${val}` : `${val}`;
  }

  selectOption(key: string) {
    this.selectedOption.set(key);
    // Save answer
    const currentQuestion = this.questions()[this.currentQuestionIndex()];
    if (currentQuestion) {
      this.userAnswers.update(map => {
        const newMap = new Map(map);
        newMap.set(currentQuestion._id, key);
        return newMap;
      });
    }
  }

  nextQuestion() {
    const currentIndex = this.currentQuestionIndex();
    if (currentIndex < this.questions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      // Restore selected option if already answered
      const nextQuestionId = this.questions()[this.currentQuestionIndex()]._id;
      const savedAnswer = this.userAnswers().get(nextQuestionId);
      this.selectedOption.set(savedAnswer || null);
    }
  }

  prevQuestion() {
    const currentIndex = this.currentQuestionIndex();
    if (currentIndex > 0) {
      this.currentQuestionIndex.update(i => i - 1);
      // Restore selected option
      const prevQuestionId = this.questions()[this.currentQuestionIndex()]._id;
      const savedAnswer = this.userAnswers().get(prevQuestionId);
      this.selectedOption.set(savedAnswer || null);
    }
  }

  submitQuiz() {
    // Convert Map to array format expected by API
    const answers = Array.from(this.userAnswers().entries()).map(([questionId, correct]) => ({
      questionId,
      correct
    }));

    this.subscription.add(
      this.questionsService.checkQuestions(answers).subscribe({
        next: (response) => {
          this.quizResult.set(response);
          this.isSubmitted.set(true);
          this.toastr.success('Quiz Submitted Successfully!', 'Success');
          if (this.timerInterval) clearInterval(this.timerInterval);
        },
        error: (err) => {
          console.error('Submission Error:', err);
          this.toastr.error('Failed to submit quiz. Please try again.', 'Error');
        }
      })
    );
  }

  restartQuiz() {
    this.currentQuestionIndex.set(0);
    this.selectedOption.set(null);
    this.userAnswers.set(new Map());
    this.isSubmitted.set(false);
    this.quizResult.set(null);
    this.timerStarted = false;

    const examData = this.exam();
    if (examData && examData.duration) {
      this.startTimer(examData.duration);
    }
  }
}
