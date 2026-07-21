import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Crea tu cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?
          <a routerLink="/login" class="font-medium text-red-600 hover:text-red-500">
            Inicia sesión aquí
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
                <input id="email" name="email" type="email" autocomplete="email" required [(ngModel)]="userData.email"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-slate-700">Contraseña</label>
              <div class="mt-1">
                <input id="password" name="password" type="password" autocomplete="new-password" required [(ngModel)]="userData.password"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="address" class="block text-sm font-medium text-slate-700">Dirección de Entrega</label>
              <div class="mt-1">
                <input id="address" name="address" type="text" required [(ngModel)]="userData.address"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-slate-700">Teléfono</label>
              <div class="mt-1">
                <input id="phone" name="phone" type="tel" required [(ngModel)]="userData.phone"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors">
                {{ loading ? 'Registrando...' : 'Registrarse' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  userData = {
    email: '',
    password: '',
    address: '',
    phone: '',
    role: 'client'
  };
  
  errorMessage = '';
  loading = false;

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';
    
    this.authService.register(this.userData).subscribe({
      next: () => {
        // Automatically login after successful registration
        this.authService.login({ email: this.userData.email, password: this.userData.password }).subscribe({
          next: () => {
            this.router.navigate(['/menu']);
          },
          error: () => {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'Error al registrarse';
      }
    });
  }
}
