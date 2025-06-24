import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { ToastService } from '@service/toast.service'; // Ajusta si es necesario

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (!isPlatformBrowser(platformId)) return false;

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('nombreUsuario');
  const rolesPermitidos = route.data['roles'] as string[];
  console.log('Token:', token);
  console.log('User:', userStr);
  console.log('Roles requeridos:', rolesPermitidos);

  if (token && userStr) {
    const user = localStorage.getItem('rol')!;

    if (rolesPermitidos && !rolesPermitidos.includes(user)) {
      setTimeout(() => {
        toastService.show('No tienes permiso para acceder a esta sección', 'danger');
        router.navigate(['/perfil']);
      }, 0);
      return false;
    }

    return true;
  } else {
    setTimeout(() => {
      toastService.show('Debes iniciar sesión', 'danger');
      router.navigate(['/iniciar-sesion']);
    }, 0);
    return false;
  }
};

