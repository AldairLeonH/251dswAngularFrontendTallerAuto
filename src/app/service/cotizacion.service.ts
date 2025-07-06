import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IActualizarTotalCotizacionRequest } from '@model/actualizar-total-cotizacion-request';
import { IAgregarMultiplesMaterialesRequest } from '@model/agregar-multiples-materiales-request';
import { IAgregarMultiplesServiciosRequest } from '@model/agregar-multiples-servicios-request';
import { ICotizacionMultiplesMaterialesResponse } from '@model/cotizacion-multiples-materiales-response';
import { ICotizacionMultiplesServiciosResponse } from '@model/cotizacion-multiples-servicios-response';
import { ICotizacionRequest } from '@model/cotizacion-request';
import { ICotizacionResponse } from '@model/cotizacion-response';
import { ICotizacionServicioResponse } from '@model/cotizacion-servicio-response';
import { IMaterialConCantidadResponse } from '@model/material-con-cantidad-response';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  constructor(private http: HttpClient) { }
  registrarCotizacion(cotizacion: ICotizacionRequest): Observable<ICotizacionResponse> {
    return this.http.post<ICotizacionResponse>(`${BASE_URL}/cotizaciones`, cotizacion);
  }
  agregarServiciosACotizacion(request: IAgregarMultiplesServiciosRequest): 
    Observable<ICotizacionMultiplesServiciosResponse> {
    return this.http.post<ICotizacionMultiplesServiciosResponse>(
      `${BASE_URL}/cotizaciones/agregar-servicios`, 
      request
    );
  }
  agregarMaterialesACotizacion(request: IAgregarMultiplesMaterialesRequest): 
    Observable<ICotizacionMultiplesMaterialesResponse> {
    return this.http.post<ICotizacionMultiplesMaterialesResponse>(
      `${BASE_URL}/cotizaciones/agregar-materiales`, 
      request
    );
  }
  actualizarTotalCotizacion(request: IActualizarTotalCotizacionRequest): Observable<{ mensaje: string }> {
  return this.http.post<{ mensaje: string }>(
    `${BASE_URL}/cotizaciones/actualizar-total`,
    request
  );
  }
  getCotizaciones(): Observable<ICotizacionResponse[]> {
    return this.http.get<ICotizacionResponse[]>(`${BASE_URL}/cotizaciones`);
  }

  getMaterialesPorCotizacion(idCotizacion: number): Observable<IMaterialConCantidadResponse[]> {
    return this.http.get<IMaterialConCantidadResponse[]>(
      `${BASE_URL}/cotizaciones/${idCotizacion}/materiales`
    );
  }
  getServiciosPorCotizacion(idCotizacion: number): Observable<ICotizacionServicioResponse[]> {
    return this.http.get<ICotizacionServicioResponse[]>(
      `${BASE_URL}/cotizaciones/${idCotizacion}/servicios`
    );
  }    

  pagarCotizacion(idCotizacion: number): Observable<ICotizacionResponse> {
    return this.http.post<ICotizacionResponse>(
      `${BASE_URL}/cotizaciones/${idCotizacion}/pagar`,
      {}
    );
  }

  expirarCotizacion(idCotizacion: number): Observable<ICotizacionResponse> {
    return this.http.post<ICotizacionResponse>(
      `${BASE_URL}/cotizaciones/${idCotizacion}/expirar`,
      {}
    );
  }

  cancelarCotizacion(idCotizacion: number): Observable<ICotizacionResponse> {
    return this.http.post<ICotizacionResponse>(
      `${BASE_URL}/cotizaciones/${idCotizacion}/cancelar`,
      {}
    );
  }

  extenderTiempoExpiracion(idCotizacion: number): Observable<ICotizacionResponse> {
    return this.http.post<ICotizacionResponse>(
      `${BASE_URL}/cotizaciones/${idCotizacion}/extender-tiempo`,
      {}
    );
  }

  getEstadoCotizacion(idCotizacion: number): Observable<any> {
    return this.http.get<any>(
      `${BASE_URL}/cotizaciones/${idCotizacion}/estado`
    );
  }

  getEstadosCotizaciones(): Observable<any[]> {
    return this.http.get<any[]>(
      `${BASE_URL}/cotizaciones/estados`
    );
  }

  agregarServicio(request: any): Observable<ICotizacionServicioResponse> {
    return this.http.post<ICotizacionServicioResponse>(
      `${BASE_URL}/cotizaciones/agregar-servicio`,
      request
    );
  }

  agregarMaterial(request: any): Observable<any> {
    return this.http.post<any>(
      `${BASE_URL}/cotizaciones/agregar-material`,
      request
    );
  }
}
