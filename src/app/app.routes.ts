import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { IniciarSesionComponent } from './component/iniciar-sesion/iniciar-sesion.component';

export const routes: Routes = [
          {path:'',redirectTo:'/home',pathMatch:'full'},
          {path: 'home',component: HomeComponent},
          {path: 'iniciar-sesion',component: IniciarSesionComponent},
];
  