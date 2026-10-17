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
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a routerLink="/" class="inline-block mb-3">
          <img src="assets/logo.png" alt="King Dogos GDL" class="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain rounded-full border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] bg-black p-1 hover:scale-105 transition-transform" />
        </a>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Crea tu cuenta
        </h2>
        <p class="mt-2 text-xs sm:text-sm text-slate-600">
          ¿Ya tienes cuenta?
          <a routerLink="/login" class="font-bold text-amber-600 hover:text-amber-500">
            Inicia sesión aquí
          </a>
        </p>
      </div>

      <div class="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-6 sm:py-8 px-4 sm:px-10 rounded-2xl shadow-xl border border-slate-100">
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <div *ngIf="errorMessage" class="bg-red-50 p-4 rounded-md text-red-600 text-sm">
              {{ errorMessage }}
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-slate-700">Correo Electrónico</label>
              <div class="mt-1">
                <input id="email" name="email" type="email" autocomplete="email" required [(ngModel)]="userData.email"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-slate-700">Contraseña</label>
              <div class="mt-1">
                <input id="password" name="password" type="password" autocomplete="new-password" required [(ngModel)]="userData.password"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="address" class="block text-sm font-medium text-slate-700">Dirección de Entrega</label>
              <div class="mt-1">
                <input id="address" name="address" type="text" required [(ngModel)]="userData.address"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm">
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-slate-700">Teléfono</label>
              <div class="mt-1">
                <input id="phone" name="phone" type="tel" required [(ngModel)]="userData.phone"
                  class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm">
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loading"
                class="w-full flex justify-center py-3 px-4 rounded-xl shadow-md text-sm font-black text-black bg-amber-400 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 disabled:opacity-50 transition-all hover:scale-[1.02]">
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
