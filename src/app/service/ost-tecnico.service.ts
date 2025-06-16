import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class OstTecnicoService {

  constructor(private http: HttpClient) {}

  obtenerTecnicos() {
    return this.http.get<any[]>(`${BASE_URL}/tecnicos`);
  }

  obtenerAsignacionesPorOst(idOst : number) {
    return this.http.get<any[]>(`${BASE_URL}/ost-tecnico/por-ost/${idOst}`);
  }

  eliminarAsignacion(idOst: number, idTecnico: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/ost-tecnico/${idOst}/${idTecnico}`);
  }

  obtenerEstados() {
    return this.http.get<any[]>(`${BASE_URL}/estados`);
  }

  asignarTecnicos(dto: any) {
    return this.http.post(`${BASE_URL}/ost-tecnico/asignar`, dto);
  }
}
