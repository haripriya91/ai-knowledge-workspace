import { CanActivateFn , Router} from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access_token');

  return token
    ? true
    : inject(Router).createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
};