import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategoriaItem } from '@model/categoria-item';
import { IInventarioAutoRequest } from '@model/inventario-auto-request';
import { BASE_URL } from '@utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) {}

  getCategoriasConItems(): Observable<ICategoriaItem[]> {
    return this.http.get<ICategoriaItem[]>(`${BASE_URL}/categorias-items`);
  }

  registrarInventario(payload: IInventarioAutoRequest): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/registrar`, payload);
  }
}
