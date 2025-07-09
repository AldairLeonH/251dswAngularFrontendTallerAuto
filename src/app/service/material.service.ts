import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMaterialResponse } from '@model/material-response';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {


  constructor(private http: HttpClient) {}

  getMateriales(): Observable<IMaterialResponse[]> {
    return this.http.get<IMaterialResponse[]>(`${BASE_URL}/materiales`);
  }

  // Obtener material por ID
  getMaterialById(id: number): Observable<IMaterialResponse> {
    return this.http.get<IMaterialResponse>(`${BASE_URL}/materiales/${id}`);
  }

  // Crear material
  createMaterial(material: Partial<IMaterialResponse>): Observable<IMaterialResponse> {
    return this.http.post<IMaterialResponse>(`${BASE_URL}/materiales`, material);
  }

  // Editar material
  updateMaterial(id: number, material: Partial<IMaterialResponse>): Observable<IMaterialResponse> {
    return this.http.put<IMaterialResponse>(`${BASE_URL}/materiales/${id}`, material);
  }

  // Eliminar material
  deleteMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/materiales/${id}`);
  }

  // Actualizar solo el stock
  updateStock(id: number, nuevoStock: number): Observable<IMaterialResponse> {
    return this.http.patch<IMaterialResponse>(`${BASE_URL}/materiales/${id}/stock`, nuevoStock);
  }
}
