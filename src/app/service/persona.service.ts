import { Injectable } from '@angular/core';
import { IPersona } from '../model/persona';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../utils/contans';
import { IPersonaRequest } from '../model/persona-request';
import { IPersonaResponse } from '../model/persona-response';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient) { }
  getPersonas(): Observable<IPersona[]> {
    return this.http.get<IPersona[]>(`${BASE_URL}/persona`);
  }
  registrarPersona(persona: IPersonaRequest): Observable<IPersonaResponse> {
    console.log(persona);
    return this.http.post<IPersonaResponse>(`${BASE_URL}/persona`, persona);
  }
  eliminarPersona(persona: IPersonaRequest): Observable<IPersonaResponse> { 
    return this.http.delete<IPersonaResponse>(`${BASE_URL}/persona`, {
      body: persona,
    });
  }
  actualizarPersona(persona: IPersonaRequest): Observable<IPersonaResponse> {
    return this.http.put<IPersonaResponse>(`${BASE_URL}/persona`, persona);
  }
}
