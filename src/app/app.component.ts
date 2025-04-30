import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IniciarSesionComponent } from "./component/iniciar-sesion/iniciar-sesion.component";
import { PaginaInicioComponent } from "./component/pagina-inicio/pagina-inicio.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PaginaInicioComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '251dswAngularFrontendTallerAuto';
}
