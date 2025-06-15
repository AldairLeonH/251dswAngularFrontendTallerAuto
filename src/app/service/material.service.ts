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
}
