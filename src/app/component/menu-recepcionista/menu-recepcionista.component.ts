import { Component,OnInit } from '@angular/core';
import { AuthService } from '@service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-menu-recepcionista',
  imports: [CommonModule,RouterModule],
  templateUrl: './menu-recepcionista.component.html',
  styleUrl: './menu-recepcionista.component.css'
})
export class MenuRecepcionistaComponent implements OnInit {
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
