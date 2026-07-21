import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 py-12 px-6">
      <div class="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <a routerLink="/" class="text-red-500 font-bold hover:text-red-600 flex items-center gap-2 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al Inicio
        </a>
        <a routerLink="/menu" class="text-slate-600 font-bold hover:text-slate-900 transition-colors">
          Menú
        </a>
      </div>
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-extrabold text-slate-900 mb-8 flex items-center gap-4">
          Mis Órdenes
        </h2>

        <div *ngIf="orders.length === 0 && !loading" class="bg-white p-12 rounded-3xl shadow-sm text-center border border-slate-100">
          <svg class="w-24 h-24 text-slate-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">No tienes órdenes aún</h3>
          <p class="text-slate-500 mb-8">Ve a nuestro menú y pide algo delicioso.</p>
          <a routerLink="/menu" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
            Ver Menú
          </a>
        </div>

        <div *ngIf="loading" class="text-center py-12">
          <div class="text-slate-500">Cargando tus órdenes...</div>
        </div>

        <div *ngIf="orders.length > 0" class="space-y-6">
          <div *ngFor="let order of orders" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-6">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-slate-900">Orden #{{ order.id }}</h3>
                <span class="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider" [ngClass]="getStatusBadgeClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
              <p class="text-sm text-slate-500 mb-4">Realizada el: {{ order.createdAt | date:'short' }}</p>
              
              <div class="space-y-2">
                <div *ngFor="let item of order.OrderItems" class="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-slate-900">{{ item.quantity }}x</span>
                    <span class="text-slate-700 font-medium">{{ item.Dish?.name }}</span>
                  </div>
                  <span class="text-slate-500 font-bold">$ {{ item.unitPrice }}</span>
                </div>
              </div>
            </div>

            <div class="md:w-64 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <p class="text-slate-400 text-sm mb-1">Total a pagar</p>
                <p class="text-3xl font-bold text-red-500">$ {{ order.totalAmount }}</p>
              </div>
              <div class="mt-6">
                <p class="text-slate-400 text-sm mb-1">Hora de Entrega</p>
                <p class="font-bold">{{ order.requestedDeliveryTime ? (order.requestedDeliveryTime | date:'shortTime') : 'Lo antes posible' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  router = inject(Router);

  orders: any[] = [];
  loading = true;

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    const token = this.authService.getToken();
    this.apiService.getMyOrders(token!).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
        }
      }
    });
  }

  getStatusBadgeClass(status: string) {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'delivering': return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'completed': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  getStatusText(status: string) {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'preparing': return 'Preparando';
      case 'delivering': return 'En Camino';
      case 'completed': return 'Completado';
      default: return status;
    }
  }
}
