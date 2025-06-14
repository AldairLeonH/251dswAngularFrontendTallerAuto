import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '@utils/contans';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {


  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/tecnico`);
  }
}
