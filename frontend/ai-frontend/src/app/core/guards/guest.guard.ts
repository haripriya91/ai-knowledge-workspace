import { CanActivateFn,  Router } from '@angular/router';
import { inject } from '@angular/core';

export const guestGuard: CanActivateFn = (route, state) => {
  return localStorage.getItem('access_token')
    ? inject(Router).createUrlTree(['/dashboard'])
    : true;
};