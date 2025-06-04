import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAuto } from '../model/auto';
import { BASE_URL } from '../utils/contans';
import { IAutoResponse } from '@model/auto-response';
import { IAutoRequest } from '@model/auto-request';

@Injectable({
  providedIn: 'root'
})
export class AutoService {

  constructor(private http: HttpClient) {}
  registrarAuto(auto:IAutoRequest): Observable<IAutoResponse> {//por parte del cliente
    console.log(auto);
    return this.http.post<IAutoResponse>(`${BASE_URL}/auto`, auto);
  }
  eliminarAuto(auto: IAutoRequest): Observable<IAutoResponse> { //por parte del cliente
    return this.http.delete<IAutoResponse>(`${BASE_URL}/auto`, {
      body: auto,
    });
  }
  actualizarAuto(auto: IAutoRequest): Observable<IAutoResponse> { //por parte del cliente
    return this.http.put<IAutoResponse>(`${BASE_URL}/auto`, auto);
  } 

  crearAuto(auto: IAuto): Observable<IAuto> {//por parte del recepcionista
    return this.http.post<IAuto>(`${BASE_URL}/auto`, auto);
  }

  buscarAutoPorPlaca(placa: string): Observable<IAuto> {
    return this.http.get<IAuto>(`${BASE_URL}/auto/placa/${placa}`);
  }
  
  
}