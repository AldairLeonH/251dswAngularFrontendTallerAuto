import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EvidenciaDTO } from '@model/evidencia-tecnico';
import { OstTecnicoCompletoDTO } from '@model/ost-tecnico-completo-response';
import { OstTecnicoResponse } from '@model/ost-tecnico-response';
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

  finalizarTrabajo(idOst: number, idTecnico: number, observaciones: string): Observable<void> {
    return this.http.put<void>(
      `${BASE_URL}/ost-tecnico/finalizar/${idOst}/${idTecnico}?observaciones=${encodeURIComponent(observaciones)}`,
      {}
    );
  }


  asignarTecnicos(dto: any) {
    return this.http.post(`${BASE_URL}/ost-tecnico/asignar`, dto);
  }

  getOstsPorTecnico(idTecnico: number): Observable<OstTecnicoCompletoDTO[]> {
    return this.http.get<OstTecnicoCompletoDTO []>(`${BASE_URL}/ost-tecnico/por-tecnico/${idTecnico}`);
  }

  getDetalleOstsPorTecnico(idTecnico: number): Observable<OstTecnicoResponse[]> {
    return this.http.get<OstTecnicoResponse[]>(`${BASE_URL}/ost-tecnico/detalle-por-tecnico/${idTecnico}`);
  }

  actualizarEstadoOstTecnico(idOst: number, idTecnico: number, idEstado: number): Observable<void> {
    return this.http.put<void>(`${BASE_URL}/ost-tecnico/estado?idOst=${idOst}&idTecnico=${idTecnico}&idEstado=${idEstado}`, {});
  }


  subirEvidencia(
    archivo: File,
    idOst: number,
    idTecnico: number,
    descripcion: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('idOst', idOst.toString());
    formData.append('idTecnico', idTecnico.toString());
    formData.append('descripcion', descripcion);

    return this.http.post<void>(`${BASE_URL}/evidencias/subir`, formData);
  }

  getEvidenciasPorOstTecnico(idOst: number, idTecnico: number): Observable<EvidenciaDTO[]> {
    return this.http.get<EvidenciaDTO[]>(`${BASE_URL}/evidencias/mis-evidencias/${idOst}/${idTecnico}`);
  }
  
}
