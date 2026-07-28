import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar / Navbar (Mobile: Top, Desktop: Left) -->
      <nav class="bg-slate-900 w-full md:w-64 md:min-h-screen flex flex-col md:fixed">
        <div class="p-6 flex items-center justify-between md:justify-center">
          <a routerLink="/" class="text-2xl font-black tracking-tighter text-white">
            SUSHI<span class="text-red-500">PEKITEKI</span><span class="text-xs ml-1 text-slate-400 font-normal tracking-normal uppercase">Admin</span>
          </a>
        </div>
        <div class="flex md:flex-col overflow-x-auto md:overflow-x-visible md:mt-6 px-4 md:px-0 pb-2 md:pb-0 hide-scrollbar gap-2 md:gap-0">
          <a routerLink="/admin" class="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap md:whitespace-normal font-medium">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            Órdenes
          </a>
          <a routerLink="/admin/dishes" class="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap md:whitespace-normal font-medium">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Menú
          </a>
          <a routerLink="/admin/users" class="flex items-center gap-3 px-6 py-4 text-white bg-slate-800 border-l-4 border-red-500 whitespace-nowrap md:whitespace-normal font-bold">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Usuarios
          </a>
          <button (click)="logout()" class="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors whitespace-nowrap md:whitespace-normal font-medium mt-auto">
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 md:ml-64 p-6 md:p-10 flex flex-col min-h-screen">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Usuarios</h1>
            <p class="text-slate-500 mt-2">Gestiona a los clientes registrados en la plataforma.</p>
          </div>
          <div class="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="font-bold text-slate-700">{{ users.length }} Registrados</span>
          </div>
        </div>

        <div *ngIf="loading" class="flex-1 flex items-center justify-center">
          <div class="flex flex-col items-center gap-4">
            <div class="w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin"></div>
            <p class="text-slate-500 font-medium">Cargando usuarios...</p>
          </div>
        </div>
        
        <!-- Users Table -->
        <div *ngIf="!loading" class="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex-1">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50">
                  <th class="py-4 px-6 font-bold text-slate-900 text-sm border-b border-slate-100">ID / FECHA REGISTRO</th>
                  <th class="py-4 px-6 font-bold text-slate-900 text-sm border-b border-slate-100">CLIENTE</th>
                  <th class="py-4 px-6 font-bold text-slate-900 text-sm border-b border-slate-100">CONTACTO</th>
                  <th class="py-4 px-6 font-bold text-slate-900 text-sm border-b border-slate-100 text-right">ROL</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users" class="group border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td class="py-5 px-6 align-top">
                    <div class="font-bold text-slate-900 mb-1">#{{ user.id }}</div>
                    <div class="text-xs font-medium text-slate-500 uppercase tracking-wider">{{ user.createdAt | date:'dd MMM yyyy' }}</div>
                  </td>
                  <td class="py-5 px-6 align-top">
                    <div class="font-bold text-slate-900 flex items-center gap-2">
                      {{ user.email }}
                      <span *ngIf="user.role === 'admin'" class="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-black px-2 py-0.5 rounded-md">Admin</span>
                    </div>
                  </td>
                  <td class="py-5 px-6 align-top">
                    <div class="text-sm text-slate-700 mb-1 flex items-center gap-2">
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                      {{ user.phone || 'Sin teléfono' }}
                    </div>
                    <div class="text-sm text-slate-500 flex items-start gap-2">
                      <svg class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span class="max-w-[200px]">{{ user.address || 'Sin dirección registrada' }}</span>
                    </div>
                  </td>
                  <td class="py-5 px-6 align-top text-right">
                    <span [class.bg-indigo-100]="user.role === 'admin'" [class.text-indigo-700]="user.role === 'admin'" [class.bg-slate-100]="user.role === 'client'" [class.text-slate-600]="user.role === 'client'" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                      {{ user.role === 'admin' ? 'Administrador' : 'Cliente' }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="users.length === 0">
                  <td colspan="4" class="py-12 text-center text-slate-500">
                    No hay usuarios registrados.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class AdminUsersComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  router = inject(Router);

  users: any[] = [];
  loading = true;

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.apiService.getAdminUsers(token).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
