import { CanActivateFn } from '@angular/router';

export const workspacePermissionGuard: CanActivateFn = (route, state) => {
  return true;
};
