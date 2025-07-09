import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { 
  EncuestaSatisfaccionRequest, 
  EvaluacionRequest
} from '../model/encuesta-satisfaccion-request';
import { EncuestaSatisfaccionResponse, EvaluacionResponse } from '../model/encuesta-satisfaccion-response';
import { 
  PreguntaEvaluacionRequest, 
  PreguntaEvaluacionResponse 
} from '../model/pregunta-evaluacion';

@Injectable({
  providedIn: 'root'
})
export class EncuestaSatisfaccionService {
  private baseUrl = environment.url + '/api/v2';

  constructor(private http: HttpClient) { }

  /**
   * Procesa una encuesta de satisfacción
   */
  procesarEncuestaSatisfaccion(request: EncuestaSatisfaccionRequest): Observable<EncuestaSatisfaccionResponse> {
    return this.http.post<EncuestaSatisfaccionResponse>(
      `${this.baseUrl}/encuesta-satisfaccion`,
      request
    );
  }

  /**
   * Obtiene una encuesta por ID de recibo
   */
  obtenerEncuestaPorRecibo(idRecibo: number): Observable<EncuestaSatisfaccionResponse> {
    return this.http.get<EncuestaSatisfaccionResponse>(
      `${this.baseUrl}/encuesta-satisfaccion/recibo/${idRecibo}`
    );
  }

  /**
   * Obtiene todas las encuestas
   */
  obtenerTodasLasEncuestas(): Observable<EncuestaSatisfaccionResponse[]> {
    return this.http.get<EncuestaSatisfaccionResponse[]>(
      `${this.baseUrl}/encuesta-satisfaccion/todas`
    );
  }

  /**
   * Verifica si un recibo tiene encuesta
   */
  verificarEncuestaRecibo(idRecibo: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/encuesta-satisfaccion/verificar/${idRecibo}`
    );
  }

  /**
   * Obtiene estadísticas de satisfacción
   */
  obtenerEstadisticasSatisfaccion(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/encuesta-satisfaccion/estadisticas`
    );
  }

  /**
   * Obtiene todas las preguntas de evaluación
   */
  obtenerPreguntasEvaluacion(): Observable<PreguntaEvaluacionResponse[]> {
    return this.http.get<PreguntaEvaluacionResponse[]>(
      `${this.baseUrl}/preguntasevaluacion/obtener`
    );
  }

  /**
   * Obtiene una pregunta por ID
   */
  obtenerPreguntaPorId(id: number): Observable<PreguntaEvaluacionResponse> {
    return this.http.get<PreguntaEvaluacionResponse>(
      `${this.baseUrl}/preguntasevaluacion/${id}`
    );
  }

  /**
   * Crea una nueva pregunta
   */
  crearPregunta(request: PreguntaEvaluacionRequest): Observable<PreguntaEvaluacionResponse> {
    return this.http.post<PreguntaEvaluacionResponse>(
      `${this.baseUrl}/preguntasevaluacion/subir`,
      request
    );
  }

  /**
   * Actualiza una pregunta existente
   */
  actualizarPregunta(id: number, request: PreguntaEvaluacionRequest): Observable<PreguntaEvaluacionResponse> {
    return this.http.put<PreguntaEvaluacionResponse>(
      `${this.baseUrl}/preguntasevaluacion/${id}`,
      request
    );
  }

  /**
   * Elimina una pregunta
   */
  eliminarPregunta(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/preguntasevaluacion/${id}`
    );
  }

  /**
   * Obtiene encuestas de un cliente específico
   */
  obtenerEncuestasPorCliente(idCliente: number): Observable<EncuestaSatisfaccionResponse[]> {
    return this.http.get<EncuestaSatisfaccionResponse[]>(
      `${this.baseUrl}/encuesta-satisfaccion/cliente/${idCliente}`
    );
  }

  /**
   * Obtiene cotizaciones pagadas sin encuesta de un cliente
   */
  obtenerCotizacionesPendientesEncuesta(idCliente: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/encuesta-satisfaccion/cotizaciones-pendientes/${idCliente}`
    );
  }
} 