import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu-tecnico',
  imports: [CommonModule],
  templateUrl: './menu-tecnico.component.html',
  styleUrl: './menu-tecnico.component.css'
})
export class MenuTecnicoComponent implements OnInit{
  rol: string = '';
  nombres: string = '';
  nombreUsuario: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
    this.rol = localStorage.getItem('rol') || '';
    this.nombres = localStorage.getItem('nombreCompleto') || '';
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
      }
  }  
  navigate(path: string): void {
    this.router.navigate([path]);
  }
  goBack(): void {
  this.router.navigate(['/iniciar-sesion']); // o cualquier ruta que quieras
  }
  
  logout() {
    localStorage.clear(); // Elimina todos los datos guardados del usuario
    this.router.navigate(['/iniciar-sesion']); // Redirige al login
  }

}
