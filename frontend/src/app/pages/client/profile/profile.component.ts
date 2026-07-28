import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 py-12 px-6">
      <div class="max-w-2xl mx-auto mb-6">
        <a routerLink="/" class="text-red-500 font-bold hover:text-red-600 flex items-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al Inicio
        </a>
      </div>
      <div class="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        
        <h2 class="text-4xl font-extrabold text-slate-900 mb-8 flex items-center gap-4">
          <svg class="w-10 h-10 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Mi Perfil
        </h2>

        <div *ngIf="loading" class="text-center py-8">
          <p class="text-slate-500 font-medium">Cargando...</p>
        </div>
        
        <div *ngIf="!loading && !user" class="text-center py-8 bg-red-50 rounded-2xl border border-red-100">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-slate-700 font-medium mb-1">No pudimos cargar tus datos.</p>
          <p class="text-sm text-slate-500">Es posible que el servidor aún se esté actualizando. Intenta de nuevo en unos minutos.</p>
          <button (click)="fetchProfile()" class="mt-4 bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            Reintentar
          </button>
        </div>

        <form *ngIf="!loading && user" (ngSubmit)="saveProfile()" class="space-y-6">
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico</label>
            <input type="email" [value]="user.email" disabled class="w-full bg-slate-100 border-none rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed" />
            <p class="text-xs text-slate-400 mt-1">El correo no puede ser modificado.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
            <input type="text" [(ngModel)]="user.phone" name="phone" placeholder="Ej. 55 1234 5678" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Dirección de Entrega</label>
            <textarea [(ngModel)]="user.address" name="address" placeholder="Ej. Calle Siempre Viva 123, Col. Centro" class="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none h-24"></textarea>
          </div>

          <div class="pt-6 border-t border-slate-100">
            <button type="submit" [disabled]="saving" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md disabled:opacity-50">
              {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </form>

      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  router = inject(Router);
  
  user: any = null;
  loading = true;
  saving = false;

  private apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'https://sushi-app-s1qp.onrender.com/api';

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.loading = true;
    this.user = null;
    const token = this.authService.getToken();
    if (!token) return;
    
    this.http.get(`${this.apiUrl}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.user = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  saveProfile() {
    const token = this.authService.getToken();
    if (!token) return;

    this.saving = true;
    this.http.put(`${this.apiUrl}/users/profile`, {
      phone: this.user.phone,
      address: this.user.address
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.saving = false;
        Swal.fire({
          icon: 'success',
          title: 'Perfil Actualizado',
          text: 'Tus datos se guardaron correctamente.',
          confirmButtonColor: '#10b981'
        });
      },
      error: (err: any) => {
        this.saving = false;
        const errMsg = err.error?.message || err.message || 'Error desconocido';
        Swal.fire({
          icon: 'error',
          title: 'Error ' + (err.status || ''),
          text: 'No se pudo actualizar el perfil. Detalle: ' + errMsg,
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}
