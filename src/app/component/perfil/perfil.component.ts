import { Component,OnInit } from '@angular/core';
import { AuthService } from '@service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})

export class PerfilComponent {
  rol = '';
  nombres = '';
  nombreUsuario = '';
  telefono = '';
  nroDocumento = '';
  tipoDocumento = '';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.rol = localStorage.getItem('rol') || '';
      this.nombres = localStorage.getItem('nombreCompleto') || '';
      this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
      this.telefono = localStorage.getItem('telefono') || '';
      this.nroDocumento = localStorage.getItem('nroDocumento') || '';
      this.tipoDocumento = localStorage.getItem('tipoDocumento') || '';
    }
  }
}
