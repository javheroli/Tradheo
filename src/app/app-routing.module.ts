import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';
import { NoAuthGuard } from './guards/auth/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: 'signup',
    loadChildren: './pages/register/register.module#RegisterPageModule',
    canLoad: [NoAuthGuard]
  },
  { path: 'gdpr', loadChildren: './pages/gdpr/gdpr.module#GdprPageModule' },
  {
    path: 'reset',
    children: [
      {
        path: ':token',
        loadChildren: './pages/reset/reset.module#ResetPageModule',
        canLoad: [NoAuthGuard]
      }
    ]
  },
  {
    path: 'live-data',
    loadChildren: './pages/live-data/live-data.module#LiveDataPageModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'charts',
    loadChildren: './pages/charts/charts.module#ChartsPageModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'charts',
    children: [
      {
        path: ':country',
        children: [
          {
            path: ':company',
            loadChildren: './pages/charts/charts.module#ChartsPageModule',
            canLoad: [AuthGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
