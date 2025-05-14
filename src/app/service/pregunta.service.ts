import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPregunta } from '../model/pregunta';
import { BASE_URL } from '../utils/contans';

@Injectable({
  providedIn: 'root'
})
export class PreguntaService {

  constructor(private http: HttpClient) {}

  getPreguntas(): Observable<IPregunta[]> {
    return this.http.get<IPregunta[]>(`${BASE_URL}/pregunta`);
  }
}