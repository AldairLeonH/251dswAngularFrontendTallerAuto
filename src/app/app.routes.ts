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
import { SidebarLayoutComponent } from '@component/sidebar-layout/sidebar-layout.component';


export const routes: Routes = [
          {path:'',redirectTo:'/home',pathMatch:'full'},
          {path: 'home',component: HomeComponent},
          {path: 'iniciar-sesion',component: IniciarSesionComponent},
          {path: 'testeo', component: TesteoComponent},
          {path: 'registrar-cliente', component: RegistrarClienteComponent},

          
          {path: '',
           component: SidebarLayoutComponent,
           children: [
            {path: 'menu-recepcionista',component: MenuRecepcionistaComponent,canActivate: [authGuard]},
            {path: 'ingresar-clientes',component: IngresarClientesComponent,canActivate: [authGuard]}, 
            {path: 'visualizar-clientes',component: VisualizarClienteComponent, canActivate: [authGuard]},
            {path: 'ingresar-ost', component: IngresarOstComponent,canActivate: [authGuard]},
            { path: '', redirectTo: 'menu-recepcionista', pathMatch: 'full' }
            ]
          },
];