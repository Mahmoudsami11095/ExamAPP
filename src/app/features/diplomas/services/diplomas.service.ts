import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api.token';
import { Diploma, SubjectsResponse } from '../models/diploma.model';

@Injectable({
    providedIn: 'root'
})
export class DiplomasService {

    constructor(private http: HttpClient, @Inject(API_URL) private apiUrl: string) { }

    getDiplomas(): Observable<Diploma[]> {
        return this.http.get<SubjectsResponse>(`${this.apiUrl}/subjects`).pipe(
            map(response => response.subjects.map((subject) => ({
                _id: subject._id,
                title: subject.name,
                img: subject.icon
            })))
        );
    }
}
