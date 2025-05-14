import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IModelo } from '../model/modelo';
import { BASE_URL } from '../utils/contans';

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  constructor(private http: HttpClient) {}

  getModelosByMarca(idMarca: number): Observable<IModelo[]> {
    return this.http.get<IModelo[]>(`${BASE_URL}/modelo/marca/${idMarca}`);
  }

  getTodosModelos(): Observable<IModelo[]> {
    return this.http.get<IModelo[]>(`${BASE_URL}/modelo`);
  }
}