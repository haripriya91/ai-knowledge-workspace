import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';

export const workspacePermissionGuard: CanActivateFn = (route) => {

  interface User {
    id: number;
    email: string;
    workspaces: string[];
  }


  const auth = inject(AuthService);
  const router = inject(Router);

  const workspaceId = route.paramMap.get('id');
 // const user = auth.user();

 /* if (!workspaceId || !user) {
    router.navigate(['/dashboard']);
    return false;
  }

  const hasAccess = user.workspaces.includes(workspaceId);

  if (hasAccess) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false; */
  return true;
};