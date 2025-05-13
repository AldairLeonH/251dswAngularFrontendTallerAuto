import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./component/navbar/navbar.component";
import { ToastContainerComponent } from '@component/toast-container/toast-container.component';
import { IngresarClientesComponent } from './component/ingresar-clientes/ingresar-clientes.component';
import { MenuRecepcionistaComponent } from './component/menu-recepcionista/menu-recepcionista.component';
import { IniciarSesionComponent } from './component/iniciar-sesion/iniciar-sesion.component';
import { VisualizarClienteComponent } from './component/visualizar-cliente/visualizar-cliente.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet ,NavbarComponent,ToastContainerComponent
    ,IngresarClientesComponent,MenuRecepcionistaComponent,IniciarSesionComponent,VisualizarClienteComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '251dswAngularFrontendTallerAuto';
}