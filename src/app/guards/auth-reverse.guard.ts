import { CanActivateFn } from '@angular/router';

export const authReverseGuard: CanActivateFn = (route, state) => {
  return true;
};
