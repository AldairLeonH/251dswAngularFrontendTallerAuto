import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ToastService } from '@service/toast.service'; // ajusta el path según donde esté

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (token) {
    return true;
  } else {
    toastService.show('Debes iniciar sesión', 'danger'); // mensaje de error
    router.navigate(['/iniciar-sesion']);
    return false;
  }
};


/*export const authGuard: CanActivateFn = (route, state) => {
  return true;
};*/