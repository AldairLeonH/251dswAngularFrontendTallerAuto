import { Injectable } from '@angular/core';
import { IRol } from '../model/rol';
import { Observable } from 'rxjs';
import { BASE_URL } from '../utils/contans';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }
  getRoles(): Observable<IRol[]> {
    return this.http.get<IRol[]>(`${BASE_URL}/rol`);
  }
}
