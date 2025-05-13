import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { RegisterModel } from '@model/register-model';
import { TokenResponse } from '@model/token-response';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService { 
  http = inject(HttpClient);
  router = inject(Router);

  login(email: string, password: string) {
    console.log('login service');
    return this.http
      .post<TokenResponse>(`${environment.url}/api/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res?.token);
          this.router.navigate(['/']);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  register(registerData: RegisterModel) {
    console.log('Register response', registerData);
    return this.http
      .post<TokenResponse>(`${environment.url}/api/auth/register`, registerData)
      .pipe(
        tap((res) => {
          console.log('Register response', res);
        }),
        tap((res) => {
          localStorage.setItem('token', res?.token);
          this.router.navigate(['/']);
        })
      );
  }
}
