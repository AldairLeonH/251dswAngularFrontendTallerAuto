import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITipoSolucion } from '@model/tipo-solucion';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoSolucionService {

  constructor(private http: HttpClient ) { }
  getTipoSolucion(): Observable<ITipoSolucion[]> {
    return this.http.get<ITipoSolucion[]>(`${BASE_URL}/tipoSolucion`);
  }
}
