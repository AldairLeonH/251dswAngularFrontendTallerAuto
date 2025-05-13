import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUsuarioResponse } from '../model/usuario-response';
import { BASE_URL } from '../utils/contans';
import { Observable } from 'rxjs';
import { IUsuarioRequest } from '../model/usuario-request';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) {} 
  getUsuarios(): Observable<IUsuarioResponse[]> {
    return this.http.get<IUsuarioResponse[]>(`${BASE_URL}/usuario`);
  }
  registrarUsuario(usuario: IUsuarioRequest): Observable<IUsuarioResponse> {
    console.log(usuario);
    return this.http.post<IUsuarioResponse>(`${BASE_URL}/usuario`, usuario);
  }
  eliminarUsuario(usuario: IUsuarioRequest): Observable<IUsuarioResponse> {
    return this.http.delete<IUsuarioResponse>(`${BASE_URL}/usuario`, {
      body: usuario,
    });
  }
  actualizarUsuario(usuario: IUsuarioRequest): Observable<IUsuarioResponse> {
    return this.http.put<IUsuarioResponse>(`${BASE_URL}/usuario`, usuario);
  } // Inyectar HttpClient en el constructor
}
