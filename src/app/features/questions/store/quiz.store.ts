import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Question, QuizResult } from '../models/question.model';
import { Exam } from '../../exams/models/exam.model';
import { QuestionsService } from '../services/questions.service';
import { ExamsService } from '../../exams/services/exams.service';
import { ToastrService } from 'ngx-toastr';
import { tapResponse } from '@ngrx/operators';
import { switchMap, tap, forkJoin } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

type QuizState = {
    questions: Question[];
    exam: Exam | undefined;
    currentQuestionIndex: number;
    userAnswers: Map<string, string>;
    selectedOption: string | null;
    timeLeft: number;
    totalTime: number;
    isSubmitted: boolean;
    quizResult: QuizResult | null;
    isLoading: boolean;
};

const initialState: QuizState = {
    questions: [],
    exam: undefined,
    currentQuestionIndex: 0,
    userAnswers: new Map<string, string>(),
    selectedOption: null,
    timeLeft: 0,
    totalTime: 0,
    isSubmitted: false,
    quizResult: null,
    isLoading: false,
};

export const QuizStore = signalStore(
    withState(initialState),
    withComputed((store) => ({
        timer: computed(() => {
            const seconds = store.timeLeft();
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
        }),
        timerProgressOffset: computed(() => {
            const circumference = 176;
            const total = store.totalTime();
            const current = store.timeLeft();
            if (total === 0) return 0;
            return circumference * (1 - current / total);
        }),
        correctCount: computed(() => store.quizResult()?.correct ?? 0),
        incorrectCount: computed(() => {
            const result = store.quizResult();
            return result ? store.questions().length - result.correct : 0;
        }),
        resultChartStyle: computed(() => {
            const total = store.questions().length;
            const result = store.quizResult();
            if (total === 0 || !result) return {};
            const correct = result.correct;
            const percent = (correct / total) * 100;
            return { '--chart-percent': `${percent}%` };
        }),
        currentQuestion: computed(() => store.questions()[store.currentQuestionIndex()]),
        isLastQuestion: computed(() => store.currentQuestionIndex() === store.questions().length - 1),
    })),
    withMethods((store) => {
        const questionsService = inject(QuestionsService);
        const examsService = inject(ExamsService);
        const toastr = inject(ToastrService);
        let timerInterval: ReturnType<typeof setInterval> | undefined = undefined;

        return {
            loadExamData: rxMethod<string>((id$) =>
                id$.pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap((id) => {
                        return forkJoin({
                            exam: examsService.getExamById(id),
                            questions: questionsService.getQuestionsByExam(id)
                        }).pipe(
                            tapResponse({
                                next: ({ exam, questions }) => {
                                    patchState(store, { exam, questions, isLoading: false });
                                    if (exam.duration) {
                                        const totalSeconds = exam.duration * 60;
                                        patchState(store, { totalTime: totalSeconds, timeLeft: totalSeconds });
                                        // Start timer
                                        if (timerInterval) clearInterval(timerInterval);
                                        timerInterval = setInterval(() => {
                                            const current = store.timeLeft();
                                            if (current > 0) {
                                                patchState(store, { timeLeft: current - 1 });
                                            } else {
                                                clearInterval(timerInterval);
                                            }
                                        }, 1000);
                                    }
                                },
                                error: (err: HttpErrorResponse) => {
                                    console.error(err);
                                    patchState(store, { isLoading: false });
                                }
                            })
                        );
                    })
                )
            ),

            startTimerInternal: (durationMinutes: number) => {
                const totalSeconds = durationMinutes * 60;
                patchState(store, { totalTime: totalSeconds, timeLeft: totalSeconds });
                if (timerInterval) clearInterval(timerInterval);
                timerInterval = setInterval(() => {
                    const current = store.timeLeft();
                    if (current > 0) {
                        patchState(store, { timeLeft: current - 1 });
                    } else {
                        clearInterval(timerInterval);
                    }
                }, 1000);
            },

            stopTimer: () => {
                if (timerInterval) clearInterval(timerInterval);
            },

            selectOption: (key: string) => {
                patchState(store, { selectedOption: key });
                const currentQ = store.currentQuestion();
                if (currentQ) {
                    const newMap = new Map(store.userAnswers());
                    newMap.set(currentQ._id, key);
                    patchState(store, { userAnswers: newMap });
                }
            },

            nextQuestion: () => {
                const current = store.currentQuestionIndex();
                if (current < store.questions().length - 1) {
                    const nextIndex = current + 1;
                    const nextQ = store.questions()[nextIndex];
                    const savedAnswer = store.userAnswers().get(nextQ._id) || null;
                    patchState(store, { currentQuestionIndex: nextIndex, selectedOption: savedAnswer });
                }
            },

            prevQuestion: () => {
                const current = store.currentQuestionIndex();
                if (current > 0) {
                    const prevIndex = current - 1;
                    const prevQ = store.questions()[prevIndex];
                    const savedAnswer = store.userAnswers().get(prevQ._id) || null;
                    patchState(store, { currentQuestionIndex: prevIndex, selectedOption: savedAnswer });
                }
            },

            restartQuiz: () => {
                patchState(store, {
                    currentQuestionIndex: 0,
                    selectedOption: null,
                    userAnswers: new Map(),
                    isSubmitted: false,
                    quizResult: null
                });
                // Restart timer
                const exam = store.exam();
                if (exam?.duration) {
                    const totalSeconds = exam.duration * 60;
                    patchState(store, { timeLeft: totalSeconds });
                    if (timerInterval) clearInterval(timerInterval);
                    timerInterval = setInterval(() => {
                        const current = store.timeLeft();
                        if (current > 0) {
                            patchState(store, { timeLeft: current - 1 });
                        } else {
                            clearInterval(timerInterval);
                        }
                    }, 1000);
                }
            },

            submitQuiz: rxMethod<void>((trigger$) =>
                trigger$.pipe(
                    tap(() => patchState(store, { isLoading: true })),
                    switchMap(() => {
                        const answers = Array.from(store.userAnswers().entries()).map(([questionId, correct]) => ({
                            questionId,
                            correct
                        }));
                        if (timerInterval) clearInterval(timerInterval);

                        return questionsService.checkQuestions(answers).pipe(
                            tapResponse({
                                next: (result: QuizResult) => {
                                    patchState(store, { quizResult: result, isSubmitted: true, isLoading: false });
                                    toastr.success('Quiz Submitted Successfully!', 'Success');
                                },
                                error: (err: HttpErrorResponse) => {
                                    console.error(err);
                                    patchState(store, { isLoading: false });
                                    toastr.error('Failed to submit quiz.', 'Error');
                                }
                            })
                        );
                    })
                )
            )
        };
    })
);
