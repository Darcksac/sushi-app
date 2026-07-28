import { Routes } from '@angular/router';
import { HomeComponent } from './pages/client/home/home.component';
import { MenuComponent } from './pages/client/menu/menu.component';
import { CartComponent } from './pages/client/cart/cart.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { DishesComponent } from './pages/admin/dishes/dishes.component';
import { AdminUsersComponent } from './pages/admin/users/users.component';
import { ProfileComponent } from './pages/client/profile/profile.component';

import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { OrdersComponent } from './pages/client/orders/orders.component';
import { CouponsComponent } from './pages/client/coupons/coupons.component';

import { authGuard, adminGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'my-orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'my-coupons', component: CouponsComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { path: 'admin', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/dishes', component: DishesComponent, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard] },
  
  { path: '**', redirectTo: '' }
];
