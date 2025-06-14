import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '@utils/contans';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class OstTecnicoService {

  constructor(private http: HttpClient) {}

  obtenerTecnicos() {
    return this.http.get<any[]>(`${BASE_URL}/tecnicos`);
  }

  obtenerEstados() {
    return this.http.get<any[]>(`${BASE_URL}/estados`);
  }

  asignarTecnicos(dto: any) {
    return this.http.post(`${BASE_URL}/ost-tecnico/asignar`, dto);
  }
}
