import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: 'account',
    loadComponent: () =>
      import('./pages/account/account.component').then(
        (m) => m.AccountComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/account/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./pages/account/signup/signup.component').then(
            (m) => m.SignupComponent
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'patient',
        loadComponent: () =>
          import('./pages/dashboard/patient/patient.component').then(
            (m) => m.PatientComponent
          ),
      },
      {
        path: 'doctor',
        loadComponent: () =>
          import('./pages/dashboard/doctor/doctor.component').then(
            (m) => m.DoctorComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'account',
  },
];
