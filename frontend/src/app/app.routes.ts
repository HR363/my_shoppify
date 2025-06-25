import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'auth/reset-password/:token',
    loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop-routing.module').then(m => m.ShopRoutingModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
  },
  {
    path: 'admin/product-create',
    loadComponent: () => import('./admin/product-create/product-create.component').then(m => m.ProductCreateComponent)
  },
  {
    path: 'admin/product-edit/:id',
    loadComponent: () => import('./admin/product-edit/product-edit.component').then(m => m.ProductEditComponent)
  },
];
