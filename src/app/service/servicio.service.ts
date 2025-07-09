import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IServicioResponse } from '@model/servicio-response';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

export interface IServicioRequest {
  id?: number;
  nombre: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private http: HttpClient) {}

  getServicios(): Observable<IServicioResponse[]> {
    return this.http.get<IServicioResponse[]>(`${BASE_URL}/servicios`);
  }

  crearServicio(servicio: IServicioRequest): Observable<IServicioResponse> {
    return this.http.post<IServicioResponse>(`${BASE_URL}/servicios`, servicio);
  }

  actualizarServicio(servicio: IServicioRequest): Observable<IServicioResponse> {
    return this.http.put<IServicioResponse>(`${BASE_URL}/servicios/${servicio.id}`, servicio);
  }

  eliminarServicio(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/servicios/${id}`);
  }
}
