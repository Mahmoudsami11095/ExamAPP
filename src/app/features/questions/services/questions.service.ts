import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api.token';
import { Question, QuestionsResponse, QuizResult } from '../models/question.model';

@Injectable({
    providedIn: 'root'
})
export class QuestionsService {

    constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) { }

    getQuestionsByExam(examId: string): Observable<Question[]> {
        const params = new HttpParams().set('exam', examId);
        return this.http.get<QuestionsResponse>(`${this.apiUrl}/questions`, { params }).pipe(
            map(response => {
                return response.questions.map(question => ({
                    _id: question._id,
                    question: question.question,
                    correct: question.correct,
                    subject: question.subject,
                    exam: question.exam,
                    options: question.answers.map(answer => ({
                        key: answer.key,
                        value: answer.answer
                    }))
                }));
            })
        );
    }

    checkQuestions(answers: { questionId: string, correct: string }[]): Observable<QuizResult> {
        return this.http.post<QuizResult>(`${this.apiUrl}/questions/check`, { answers });
    }
}
