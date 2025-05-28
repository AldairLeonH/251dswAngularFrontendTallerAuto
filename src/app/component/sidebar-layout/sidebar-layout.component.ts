import { Component } from '@angular/core';
import { AuthService } from '@service/auth.service';
import { ActivatedRoute, NavigationEnd, Router ,RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@component/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';


@Component({
  standalone: true,
  selector: 'app-sidebar-layout',
  imports: [  RouterOutlet,SidebarComponent,],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.css'
})
export class SidebarLayoutComponent {
  
  titulo: string = 'AutoSeguro - Panel';
  
  constructor(private authService: AuthService, private router: Router) {
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        if (url.includes('perfil')) {
          this.titulo = 'Mi Perfil';
        } else if (url.includes('ingresar-clientes')) {
          this.titulo = 'Ingresar clientes';
        } else if (url.includes('ingresar-ost')) {
          this.titulo = 'Registrar Orden de Servicio Técnico';
        } else if (url.includes('visualizar-clientes')) {
          this.titulo = 'Clientes';
        } else {
          this.titulo = 'AutoSeguro - Panel';
        }
      });
  }

  logout() {
    localStorage.clear(); // Elimina todos los datos guardados del usuario
    this.router.navigate(['/iniciar-sesion']); // Redirige al login
  }
}
