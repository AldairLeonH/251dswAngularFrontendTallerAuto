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
import { Vista1Component } from './vista1/vista1.component';
import { ClienteMisAutosComponent } from '@component/cliente-mis-autos/cliente-mis-autos.component';
import { IngresarInventarioComponent } from '@component/ingresar-inventario/ingresar-inventario.component';
import { VerCotizacionesComponent } from '@component/ver-cotizaciones/ver-cotizaciones.component';
import { GestionEstadosCotizacionComponent } from '@component/gestion-estados-cotizacion/gestion-estados-cotizacion.component';
import { AgregarItemsCotizacionComponent } from '@component/agregar-items-cotizacion/agregar-items-cotizacion.component';
import { ReportesCotizacionesComponent } from '@component/reportes-cotizaciones/reportes-cotizaciones.component';
import { EncuestaSatisfaccionComponent } from '@component/encuesta-satisfaccion/encuesta-satisfaccion.component';
import { PanelEncuestasComponent } from '@component/panel-encuestas/panel-encuestas.component';
import { ConfirmacionEncuestaComponent } from '@component/confirmacion-encuesta/confirmacion-encuesta.component';
import { ClienteEncuestasComponent } from '@component/cliente-encuestas/cliente-encuestas.component';
import { DetalleEncuestaClienteComponent } from '@component/detalle-encuesta-cliente/detalle-encuesta-cliente.component';
import { ClienteRecibosComponent } from '@component/cliente-recibos/cliente-recibos.component';
import { DetalleReciboClienteComponent } from '@component/detalle-recibo-cliente/detalle-recibo-cliente.component';
import { AdminPanelComponent } from '@component/admin-panel/admin-panel.component';


export const routes: Routes = [
          {path:'',redirectTo:'/home',pathMatch:'full'},
          {path: 'home',component: HomeComponent},
          {path: 'iniciar-sesion',component: IniciarSesionComponent},
          {path: 'registrar-cliente', component: RegistrarClienteComponent},
          //{path: 'vista1', component: Vista1Component},
          {path: '',
           component: SidebarLayoutComponent,
           children: [
            {path: 'menu-recepcionista',component: MenuRecepcionistaComponent,canActivate: [authGuard],data: { roles: ['recepcionista'] } },
            {path: 'testeo',component: TesteoComponent,canActivate: [authGuard], data: { roles: ['cliente'] } },
            {path: 'menu-tecnico', component: MenuTecnicoComponent,canActivate: [authGuard],data: { roles: ['tecnico','supervisor'] } },
            {path: 'bitacora', component: BitacoraComponent,canActivate: [authGuard], data: { roles: ['tecnico','supervisor'] } },
            {path: 'perfil',component: PerfilComponent,canActivate: [authGuard],data: { roles: ['recepcionista','tecnico','cliente','supervisor','admin'] } },
            {path: 'ingresar-clientes',component: IngresarClientesComponent,canActivate: [authGuard],data: { roles: ['recepcionista'] }  }, 
            {path: 'visualizar-clientes',component: VisualizarClienteComponent, canActivate: [authGuard],data: { roles: ['recepcionista'] }  },
            {path: 'ingresar-ost', component: IngresarOstComponent,canActivate: [authGuard],data: { roles: ['recepcionista'] } } ,
            {path: 'ingresar-inventario', component: IngresarInventarioComponent,canActivate: [authGuard],data: { roles: ['recepcionista'] } } ,
            {path: 'ver-ost', component: VerOstComponent,canActivate: [authGuard],data: { roles: ['recepcionista','tecnico','supervisor'] } },
            {path: 'cliente-ost', component: ClienteOstComponent,canActivate: [authGuard], data: { roles: ['cliente'] } },
            {path: 'cliente-mis-autos', component: ClienteMisAutosComponent,canActivate: [authGuard], data: { roles: ['cliente'] } },
            { path: '', redirectTo: 'perfil', pathMatch: 'full' },
            {path: 'ver-cotizaciones', component: VerCotizacionesComponent, canActivate: [authGuard], data: { roles: ['recepcionista'] } },
            {path: 'vista-1', component: Vista1Component, canActivate: [authGuard], data: { roles: ['tecnico'] } },

            // Nuevas rutas para gestión de cotizaciones
            {path: 'cotizaciones', canActivate: [authGuard], data: { roles: ['recepcionista'] }, children: [
              {path: '', redirectTo: 'ver-cotizaciones', pathMatch: 'full'},
              {path: 'ver-cotizaciones', component: VerCotizacionesComponent},
              {path: 'gestion-estados/:id', component: GestionEstadosCotizacionComponent},
              {path: 'agregar-items/:id', component: AgregarItemsCotizacionComponent},
              {path: 'reportes', component: ReportesCotizacionesComponent}
            ]},
            
            // Rutas para encuestas de satisfacción
            {path: 'encuesta-satisfaccion/:idRecibo/:idCotizacion', component: EncuestaSatisfaccionComponent},
            {path: 'panel-encuestas', component: PanelEncuestasComponent, canActivate: [authGuard], data: { roles: ['recepcionista', 'supervisor'] }},
            {path: 'confirmacion-encuesta', component: ConfirmacionEncuestaComponent},
            {path: 'cliente-encuestas', component: ClienteEncuestasComponent, canActivate: [authGuard], data: { roles: ['cliente'] }},
            {path: 'detalle-encuesta-cliente/:idRecibo', component: DetalleEncuestaClienteComponent, canActivate: [authGuard], data: { roles: ['cliente'] }},
            {path: 'cliente-recibos', component: ClienteRecibosComponent, canActivate: [authGuard], data: { roles: ['cliente'] }},
            {path: 'detalle-recibo-cliente/:id', component: DetalleReciboClienteComponent, canActivate: [authGuard], data: { roles: ['cliente'] }},
            
            ]
          },
          { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard], data: { roles: ['admin'] } },

];