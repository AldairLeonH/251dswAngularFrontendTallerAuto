import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
  }

  get rol(): string | null {
    return localStorage.getItem('rol');
  }

  goToMainByRole() {
    const rol = this.rol;
    if (rol === 'admin') {
      this.router.navigate(['/admin']);
    } else if (rol === 'recepcionista') {
      this.router.navigate(['/menu-recepcionista']);
    } else if (rol === 'tecnico' || rol === 'supervisor') {
      this.router.navigate(['/menu-tecnico']);
    } else if (rol === 'cliente') {
      this.router.navigate(['/perfil']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
