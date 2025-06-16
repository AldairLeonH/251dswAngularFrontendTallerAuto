import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IServicioResponse } from '@model/servicio-response';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  constructor(private http: HttpClient) {}

  getServicios(): Observable<IServicioResponse[]> {
    return this.http.get<IServicioResponse[]>(`${BASE_URL}/servicios`);
  }
}
