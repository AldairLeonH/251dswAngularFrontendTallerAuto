import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';
import { ToastService } from '@service/toast.service'; // Ajusta si es necesario

export const authGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const toastService = inject(ToastService);

  // Verificar que se está ejecutando en el navegador
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      return true;
    } else {
      toastService.show('Debes iniciar sesión', 'danger');
      router.navigate(['/iniciar-sesion']);
      return false;
    }
  } else {
    // Si no es navegador (SSR, prerender), impedir acceso
    return false;
  }
};
