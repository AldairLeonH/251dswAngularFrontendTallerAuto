import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ReciboCliente {
  idRecibo: number;
  idCotizacion: number;
  fecha: string;
  montoTotal: number;
  nombreCliente: string;
  placaAuto: string;
  marcaAuto: string;
  modeloAuto: string;
  anioAuto: number;
  observaciones: string;
  estadoRecibo: string;
  fechaCreacion: string;
  subtotalMateriales: number;
  subtotalServicios: number;
}

export interface DetalleRecibo {
  idRecibo: number;
  idCotizacion: number;
  fecha: string;
  montoTotal: number;
  nombreCliente: string;
  placaAuto: string;
  marcaAuto: string;
  modeloAuto: string;
  anioAuto: number;
  observaciones: string;
  estadoRecibo: string;
  fechaCreacion: string;
  subtotalMateriales: number;
  subtotalServicios: number;
  materiales: MaterialRecibo[];
  servicios: ServicioRecibo[];
}

export interface MaterialRecibo {
  idMaterial: number;
  nombreMaterial: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface ServicioRecibo {
  idServicio: number;
  nombreServicio: string;
  descripcion: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReciboService {
  private apiUrl = environment.url;

  constructor(private http: HttpClient) { }

  obtenerRecibosPorCliente(idCliente: number): Observable<ReciboCliente[]> {
    return this.http.get<ReciboCliente[]>(`${this.apiUrl}/api/v2/recibo/cliente/${idCliente}`);
  }

  obtenerDetalleRecibo(idRecibo: number): Observable<DetalleRecibo> {
    return this.http.get<DetalleRecibo>(`${this.apiUrl}/api/v2/recibo/${idRecibo}/detalle`);
  }

  descargarRecibo(idRecibo: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/api/v2/recibo/${idRecibo}/descargar`, {
      responseType: 'blob'
    });
  }
} 