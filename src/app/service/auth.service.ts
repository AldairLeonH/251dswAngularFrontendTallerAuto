import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { RegisterModel } from '@model/register-model';
import { TokenResponse } from '@model/token-response';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);

  login(email: string, password: string) {
    console.log('login service');
    return this.http
      .post<TokenResponse>(`${environment.url}/api/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('rol', res.usuario.rol);
            localStorage.setItem('tipoDocumento', res.usuario.tipoDocumento);
            localStorage.setItem('nombreCompleto', res.usuario.nombreCompleto);
            localStorage.setItem('telefono', res.usuario.telefono);
            localStorage.setItem('nroDocumento', res.usuario.nroDocumento);
            localStorage.setItem('nombreUsuario', res.usuario.nombreUsuario);
            localStorage.setItem('idUsuario', res.usuario.id.toString());
          }
        })
      );
  }

  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/iniciar-sesion']);
  }

  register(registerData: RegisterModel) {
    return this.http
      .post<TokenResponse>(`${environment.url}/api/auth/register`, registerData)
      .pipe(
        tap((res) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', res?.token);
          }
          this.router.navigate(['/']);
        })
      );
  }
}
