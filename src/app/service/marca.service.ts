import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMarca } from '../model/marca';
import { BASE_URL } from '../utils/contans';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(private http: HttpClient) {}

  getMarcas(): Observable<IMarca[]> {
    return this.http.get<IMarca[]>(`${BASE_URL}/marca`);
  }
}