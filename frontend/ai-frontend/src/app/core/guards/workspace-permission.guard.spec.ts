import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { workspacePermissionGuard } from './workspace-permission.guard';

describe('workspacePermissionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => workspacePermissionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
