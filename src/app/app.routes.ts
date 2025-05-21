import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { IniciarSesionComponent } from './component/iniciar-sesion/iniciar-sesion.component';
import { MenuRecepcionistaComponent } from './component/menu-recepcionista/menu-recepcionista.component';
import { IngresarClientesComponent } from './component/ingresar-clientes/ingresar-clientes.component';
import { VisualizarClienteComponent } from './component/visualizar-cliente/visualizar-cliente.component';
import { IngresarOstComponent } from './component/ingresar-ost/ingresar-ost.component';
import { authGuard } from '@guards/auth.guard';
import { RegistrarClienteComponent } from '@component/registrar-cliente/registrar-cliente.component';
import { TesteoComponent } from '@component/testeo/testeo.component';


export const routes: Routes = [
          {path:'',redirectTo:'/home',pathMatch:'full'},
          {path: 'home',component: HomeComponent},
          {path: 'iniciar-sesion',component: IniciarSesionComponent},
          {path: 'menu-recepcionista',component: MenuRecepcionistaComponent,canActivate: [authGuard]},
          {path: 'ingresar-clientes',component: IngresarClientesComponent,canActivate: [authGuard]}, 
          {path: 'visualizar-clientes',component: VisualizarClienteComponent, canActivate: [authGuard]},
          {path: 'ingresar-ost', component: IngresarOstComponent,},
          {path: 'registrar-cliente', component: RegistrarClienteComponent},
          {path: 'testeo', component: TesteoComponent},
];