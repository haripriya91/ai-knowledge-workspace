import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { WorkspaceDetailsComponent } from './pages/workspace-details/workspace-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { workspacePermissionGuard } from './core/guards/workspace-permission.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [

    /* ---------- PUBLIC ---------- */
    {
      path: '',
      component: PublicLayoutComponent,
      children: [
        { path: '', component: HomeComponent },
        { path: 'workspace/:id', component: WorkspaceDetailsComponent }
      ]
    },
  
    /* ---------- AUTH ---------- */
    {
      path: 'auth',
      component: AuthLayoutComponent,
      children: [
        { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
        { path: 'signup', component: SignupComponent, canActivate: [guestGuard] }
      ]
    },
  
    /* ---------- PRIVATE ---------- */
    {
      path: '',
      component: AppLayoutComponent,
      canActivate: [authGuard],
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'workspace/:id',component: WorkspaceDetailsComponent,canActivate: [workspacePermissionGuard]}
      ]
    },
  
    /* ---------- 404 ---------- */
    { path: '**', component: NotFoundComponent }
];
