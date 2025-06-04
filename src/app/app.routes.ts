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
import { MenuTecnicoComponent } from '@component/menu-tecnico/menu-tecnico.component';
import { BitacoraComponent } from '@component/bitacora/bitacora.component';
import { SidebarLayoutComponent } from '@component/sidebar-layout/sidebar-layout.component';
import { PerfilComponent } from '@component/perfil/perfil.component';
import { VerOstComponent } from '@component/ver-ost/ver-ost.component';
import { ClienteOstComponent } from '@component/cliente-ost/cliente-ost.component';
import { ClienteMisAutosComponent } from '@component/cliente-mis-autos/cliente-mis-autos.component';


export const routes: Routes = [
          {path:'',redirectTo:'/home',pathMatch:'full'},
          {path: 'home',component: HomeComponent},
          {path: 'iniciar-sesion',component: IniciarSesionComponent},
          {path: 'registrar-cliente', component: RegistrarClienteComponent},
          
          {path: '',
           component: SidebarLayoutComponent,
           children: [
            {path: 'menu-recepcionista',component: MenuRecepcionistaComponent,canActivate: [authGuard]},
            {path: 'testeo',component: TesteoComponent,canActivate: [authGuard]},
            {path: 'menu-tecnico', component: MenuTecnicoComponent,canActivate: [authGuard]},
            {path: 'bitacora', component: BitacoraComponent,canActivate: [authGuard]},
            {path: 'perfil',component: PerfilComponent,canActivate: [authGuard]},
            {path: 'ingresar-clientes',component: IngresarClientesComponent,canActivate: [authGuard]}, 
            {path: 'visualizar-clientes',component: VisualizarClienteComponent, canActivate: [authGuard]},
            {path: 'ingresar-ost', component: IngresarOstComponent,canActivate: [authGuard]},
            {path: 'ver-ost', component: VerOstComponent,canActivate: [authGuard]},
            {path: 'cliente-ost', component: ClienteOstComponent,canActivate: [authGuard]},
            {path: 'cliente-mis-autos', component: ClienteMisAutosComponent,canActivate: [authGuard]},
            { path: '', redirectTo: 'perfil', pathMatch: 'full' }
            ]
          },

];