import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBitacora } from '@model/bitacora';
import { IBitacoraRequest } from '@model/bitacora-request';
import { IBitacoraResponse } from '@model/bitacora-response';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitacoraProblemasService {

  constructor(private http: HttpClient) { }
  getBitacoras(): Observable<IBitacora[]> {
    return this.http.get<IBitacora[]>(`${BASE_URL}/bitacora`);
  }
  registrarBitacora(bitacora: IBitacoraRequest): Observable<IBitacoraResponse> {
    console.log(bitacora);
    return this.http.post<IBitacoraResponse>(`${BASE_URL}/bitacora`, bitacora);
  }
  eliminarBitacora(bitacora: IBitacoraRequest): Observable<IBitacoraResponse> { 
    return this.http.delete<IBitacoraResponse>(`${BASE_URL}/bitacora`, {
      body: bitacora,
    });
  }
  actualizarBitacora(bitacora: IBitacoraRequest): Observable<IBitacoraResponse> {
    return this.http.put<IBitacoraResponse>(`${BASE_URL}/bitacora`, bitacora);
  }

}
