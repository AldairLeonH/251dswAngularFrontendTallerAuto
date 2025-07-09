import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = `${environment.url}/api/v2/dashboard`;

  constructor(private http: HttpClient) {}

  getVentasPorServicio(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ventas-por-servicio`);
  }

  getServiciosMasVendidosMes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/servicios-mas-vendidos-mes`);
  }

  getMaterialesMasVendidosMes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/materiales-mas-vendidos-mes`);
  }

  getIngresosPorMes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ingresos-por-mes`);
  }

  getIngresosPorDia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ingresos-por-dia`);
  }

  getTopClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/top-clientes`);
  }

  getPromedioSatisfaccionPorTecnico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/promedio-satisfaccion-tecnico`);
  }
} 