import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategoriaItem } from '@model/categoria-item';
import { IInventarioAutoRequest } from '@model/inventario-auto-request';
import { InventarioRevisionDTO } from '@model/inventario-revision';
import { IItemInventario } from '@model/item-inventario';
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

  getItems(): Observable<IItemInventario[]> {
    return this.http.get<IItemInventario[]>(`${BASE_URL}/item-inventario`);
  }
  registrarInventario(payload: InventarioRevisionDTO): Observable<void> {
    return this.http.post<void>(`${BASE_URL}/inventario-auto`, payload);
  }
}
