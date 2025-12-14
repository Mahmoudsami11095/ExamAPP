import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api.token';
import { Exam, ExamsResponse } from '../models/exam.model';

@Injectable({
    providedIn: 'root'
})
export class ExamsService {

    constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) { }

    getExamsBySubject(subjectId: string): Observable<Exam[]> {
        const params = new HttpParams().set('subject', subjectId);
        //return this.http.get<ExamsResponse>(`${this.apiUrl}/exams`, { params }).pipe(
        return this.http.get<ExamsResponse>(`${this.apiUrl}/exams`).pipe(
            map(response => response.exams)
        );
    }
}
