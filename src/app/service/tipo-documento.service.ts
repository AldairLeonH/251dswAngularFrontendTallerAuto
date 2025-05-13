import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITipoDocumento } from '../model/tipo-documento';
import { BASE_URL } from '../utils/contans';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  constructor(private http: HttpClient ) { }
  getTipoDocumentos(): Observable<ITipoDocumento[]> {
    return this.http.get<ITipoDocumento[]>(`${BASE_URL}/tipoDocumento`);
  }

}
