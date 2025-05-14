import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOstRequest } from '@model/ost-request';
import { IOstResponse } from '@model/ost-response';
import { BASE_URL } from '../utils/contans';

@Injectable({
  providedIn: 'root'
})
export class OstService {

  constructor(private http: HttpClient) {}

  registrarOst(ost: IOstRequest): Observable<IOstResponse> {
    return this.http.post<IOstResponse>(`${BASE_URL}/ost`, ost);
  }
}