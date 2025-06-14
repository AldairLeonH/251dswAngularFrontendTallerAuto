import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstadoResponse } from '@model/estado-response';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor(private http: HttpClient) { }

  getEstados(): Observable<EstadoResponse[]> {
    return this.http.get<EstadoResponse[]>(`${BASE_URL}/tipo-estado`);
  }
}