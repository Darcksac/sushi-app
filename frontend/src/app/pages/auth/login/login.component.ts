import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, GoogleSigninButtonModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Inicia sesión en tu cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-slate-600">
          ¿No tienes cuenta?
          <a routerLink="/register" class="font-medium text-red-600 hover:text-red-500">
            Regístrate aquí
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-100">
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <div *ngIf="errorMessage" class="bg-red-50 p-4 rounded-md text-red-600 text-sm">
              {{ errorMessage }}
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700">Correo Electrónico</label>
              <div class="mt-1">
                <input id="email" name="email" type="email" autocomplete="email" required [(ngModel)]="email"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-slate-700">Contraseña</label>
              <div class="mt-1">
                <input id="password" name="password" type="password" autocomplete="current-password" required [(ngModel)]="password"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors">
                {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-slate-500">
                  O continúa con
                </span>
              </div>
            </div>

            <div class="mt-6 flex justify-center">
              <asl-google-signin-button></asl-google-signin-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  socialAuthService = inject(SocialAuthService);
  
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.loading = true;
        this.errorMessage = '';
        this.authService.loginWithGoogle(user.idToken).subscribe({
          next: (res) => {
            if (res.role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/menu']);
            }
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = err.error?.message || 'Error al iniciar sesión con Google';
          }
        });
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        if (res.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error al iniciar sesión';
      }
    });
  }
}
