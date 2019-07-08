import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/login/login.module#LoginPageModule' },
  {
    path: 'signup',
    loadChildren: './pages/register/register.module#RegisterPageModule'
  },
  { path: 'gdpr', loadChildren: './pages/gdpr/gdpr.module#GdprPageModule' },
  {
    path: 'reset',
    children: [
      {
        path: ':token',
        loadChildren: './pages/reset/reset.module#ResetPageModule'
      }
    ]
  },
  {
    path: 'live-data',
    loadChildren: './pages/live-data/live-data.module#LiveDataPageModule',
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
