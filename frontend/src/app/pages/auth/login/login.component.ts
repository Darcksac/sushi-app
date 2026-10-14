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
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a routerLink="/" class="inline-block mb-3">
          <img src="assets/logo.png" alt="King Dogos GDL" class="w-24 h-24 mx-auto object-contain rounded-full border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] bg-black p-1 hover:scale-105 transition-transform" />
        </a>
        <h2 class="text-3xl font-black text-slate-900 tracking-tight">
          Inicia sesión en tu cuenta
        </h2>
        <p class="mt-2 text-sm text-slate-600">
          ¿No tienes cuenta?
          <a routerLink="/register" class="font-bold text-amber-600 hover:text-amber-500">
            Regístrate aquí
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <div *ngIf="errorMessage" class="bg-red-50 p-4 rounded-xl text-red-600 text-sm border border-red-200">
              {{ errorMessage }}
            </div>
            
            <div>
              <label for="email" class="block text-sm font-semibold text-slate-700">Correo Electrónico</label>
              <div class="mt-1">
                <input id="email" name="email" type="email" autocomplete="email" required [(ngModel)]="email"
                  class="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-semibold text-slate-700">Contraseña</label>
              <div class="mt-1">
                <input id="password" name="password" type="password" autocomplete="current-password" required [(ngModel)]="password"
                  class="appearance-none block w-full px-3 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm">
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loading"
                class="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-black text-black bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 disabled:opacity-50 transition-all hover:scale-[1.02]">
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
