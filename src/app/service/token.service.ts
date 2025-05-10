import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private getDecodedToken(): any | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedTokenString = atob(token.split('.')[1]);
      return JSON.parse(decodedTokenString);
    }
    return null;
  }

  getEmail(): string {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.email) {
      return decodedToken.email;
    }
    return 'user@mail.com';
  }

  getNames(): string {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.names) {
      return decodedToken.names;
    }
    return 'names';
  }

  getPersonaId(): string {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.personaId) {
      return decodedToken.personaId;
    }
    return 'personaId';
  }

  getClienteId(): string {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.clienteId) {
      return decodedToken.clienteId;
    }
    return 'clienteId';
  }
}
