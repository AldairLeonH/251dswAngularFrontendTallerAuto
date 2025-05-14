import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuto } from '../model/auto';
import { BASE_URL } from '../utils/contans';

@Injectable({
  providedIn: 'root'
})
export class AutoService {

  constructor(private http: HttpClient) {}

  crearAuto(auto: IAuto): Observable<IAuto> {
    return this.http.post<IAuto>(`${BASE_URL}/auto`, auto);
  }

  buscarAutoPorPlaca(placa: string): Observable<IAuto> {
    return this.http.get<IAuto>(`${BASE_URL}/auto/placa/${placa}`);
  }
}