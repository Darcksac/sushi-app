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
    <div class="min-h-screen bg-slate-950 py-6 sm:py-12 px-3.5 sm:px-6 text-slate-100">
      <div class="max-w-2xl mx-auto mb-4 sm:mb-8 flex items-center justify-between">
        <a routerLink="/" class="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1.5 sm:gap-2 transition-colors text-xs sm:text-base">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al Inicio
        </a>
        <div class="flex items-center gap-2 sm:gap-3">
          <img src="assets/logo.png" alt="King Dogos GDL" class="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full border border-amber-500/40 shadow-lg shadow-amber-500/20" />
          <span class="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">King Dogos GDL</span>
        </div>
      </div>
      <div class="max-w-2xl mx-auto bg-slate-900 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2rem] shadow-2xl border border-amber-500/20">
        
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6 sm:mb-8 flex items-center gap-2.5 sm:gap-3">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Mi Perfil King
        </h2>

        <div *ngIf="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-400 mx-auto"></div>
          <p class="text-slate-400 font-medium mt-3">Cargando perfil...</p>
        </div>
        
        <div *ngIf="!loading && !user" class="text-center py-8 bg-red-950/40 rounded-2xl border border-red-800/40">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-slate-200 font-medium mb-1">No pudimos cargar tus datos.</p>
          <p class="text-sm text-slate-400">Es posible que el servidor aún se esté actualizando. Intenta de nuevo en unos minutos.</p>
          <button (click)="fetchProfile()" class="mt-4 bg-slate-800 border border-slate-700 text-slate-200 font-bold py-2 px-4 rounded-xl hover:bg-slate-700 transition-colors shadow-sm">
            Reintentar
          </button>
        </div>

        <form *ngIf="!loading && user" (ngSubmit)="saveProfile()" class="space-y-6">
          
          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">Correo Electrónico</label>
            <input type="email" [value]="user.email" disabled class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-400 cursor-not-allowed" />
            <p class="text-xs text-slate-500 mt-1">El correo no puede ser modificado.</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">Teléfono</label>
            <input type="text" [(ngModel)]="user.phone" name="phone" placeholder="Ej. 33 1234 5678" class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors" />
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-300 mb-2">Dirección de Entrega en GDL</label>
            <textarea [(ngModel)]="user.address" name="address" placeholder="Ej. Av. Chapultepec 123, Col. Americana, Guadalajara" class="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none h-24"></textarea>
          </div>

          <div class="pt-6 border-t border-slate-800">
            <button type="submit" [disabled]="saving" class="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-4 px-6 rounded-xl transition-all shadow-lg shadow-amber-400/20 disabled:opacity-50">
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

  private apiUrl = window.location.hostname === 'localhost' ? '/api' : 'https://kingdogos.onrender.com/api';

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
