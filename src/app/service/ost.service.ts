import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOstRequest } from '@model/ost-request';
import { IOstResponse } from '@model/ost-response';
import { BASE_URL } from '../utils/contans';
import { IAuto } from '@model/auto';
import { IMarca } from '@model/marca';
import { IModelo } from '@model/modelo';
import { IPersonaResponse } from '@model/persona-response';

@Injectable({
  providedIn: 'root'
})
export class OstService {

    constructor(private http: HttpClient) {}

  getPreguntas(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/pregunta`);
  }

  getMarcas(): Observable<IMarca[]> {
    return this.http.get<IMarca[]>(`${BASE_URL}/marca`);
  }

  getModelos(): Observable<IModelo[]> {
    return this.http.get<IModelo[]>(`${BASE_URL}/modelo`);
  }
  registrarOst(ost: IOstRequest): Observable<IOstResponse> {
    return this.http.post<IOstResponse>(`${BASE_URL}/ost`, ost);
  }
  buscarAutosPorPlaca(placa: string): Observable<IAuto[]> {
    return this.http.get<IAuto[]>(`/api/auto/buscar?placa=${placa}`);
  }

  buscarPersona(filtro: string): Observable<IPersonaResponse> {
  return this.http.get<IPersonaResponse>(`${BASE_URL}/persona/buscar?filtro=${filtro}`);
}

getAutosPorPersona(idPersona: number): Observable<IAuto[]> {
  return this.http.get<any[]>(`${BASE_URL}/persona/autos/persona/${idPersona}`);
}
}