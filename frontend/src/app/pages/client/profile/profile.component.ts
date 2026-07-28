import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../../services/cart.service';
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

        <!-- Historial de Pedidos -->
        <div *ngIf="!loading && user" class="mt-12 pt-8 border-t border-slate-200">
          <h3 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Historial de Pedidos
          </h3>

          <div *ngIf="loadingOrders" class="text-center py-6">
            <div class="w-8 h-8 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          </div>

          <div *ngIf="!loadingOrders && orders.length === 0" class="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
            <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <p class="text-slate-500 font-medium">Aún no has realizado ningún pedido.</p>
            <a routerLink="/menu" class="inline-block mt-4 text-red-500 font-bold hover:text-red-600">Ir al Menú</a>
          </div>

          <div *ngIf="!loadingOrders && orders.length > 0" class="space-y-4">
            <div *ngFor="let order of orders" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-slate-900 text-lg">Pedido #{{ order.id }}</span>
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider" 
                          [ngClass]="{
                            'bg-yellow-100 text-yellow-800': order.status === 'pending',
                            'bg-blue-100 text-blue-800': order.status === 'preparing',
                            'bg-purple-100 text-purple-800': order.status === 'delivering',
                            'bg-emerald-100 text-emerald-800': order.status === 'completed'
                          }">
                      {{ order.status }}
                    </span>
                  </div>
                  <div class="text-sm text-slate-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    {{ order.createdAt | date:'dd MMM yyyy, h:mm a' }}
                  </div>
                </div>
                <div class="text-right flex sm:block items-center justify-between">
                  <div class="text-sm text-slate-500">Total</div>
                  <div class="font-bold text-red-500 text-xl">$ {{ order.totalAmount }}</div>
                </div>
              </div>

              <div class="space-y-2 mb-4">
                <div *ngFor="let item of order.OrderItems" class="flex items-start gap-3 text-sm">
                  <div class="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded shrink-0">{{ item.quantity }}x</div>
                  <div>
                    <div class="font-bold text-slate-800">{{ item.Dish?.name || 'Producto Eliminado' }}</div>
                    <div *ngIf="item.selectedCustomizations?.length" class="text-xs text-slate-500 mt-0.5">
                      Extras: <span *ngFor="let c of item.selectedCustomizations; let last = last">{{ c.name }}{{ !last ? ', ' : '' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-slate-100">
                <button (click)="reorder(order)" class="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Volver a Pedir
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  router = inject(Router);
  cartService = inject(CartService);
  
  user: any = null;
  loading = true;
  saving = false;
  
  orders: any[] = [];
  loadingOrders = false;

  private apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'https://sushi-app-s1qp.onrender.com/api';

  ngOnInit() {
    this.fetchProfile();
    this.fetchOrders();
  }

  fetchOrders() {
    const token = this.authService.getToken();
    if (!token) return;

    this.loadingOrders = true;
    this.apiService.getMyOrders(token).subscribe({
      next: (res: any) => {
        this.orders = res;
        this.loadingOrders = false;
      },
      error: (err: any) => {
        console.error('Error loading orders', err);
        this.loadingOrders = false;
      }
    });
  }

  reorder(order: any) {
    if (!order.OrderItems || order.OrderItems.length === 0) return;

    // Optional: Ask for confirmation if they already have items in the cart
    const currentItems = this.cartService.items();
    if (currentItems.length > 0) {
      Swal.fire({
        title: '¿Vaciar carrito actual?',
        text: 'Tienes productos en tu carrito. Para reordenar este pedido necesitamos vaciarlo primero.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Sí, vaciar y reordenar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.executeReorder(order);
        }
      });
    } else {
      this.executeReorder(order);
    }
  }

  private executeReorder(order: any) {
    this.cartService.clearCart();
    
    // Add all items from the previous order to the cart
    for (const item of order.OrderItems) {
      if (item.Dish) {
        this.cartService.addToCart(
          item.Dish, 
          item.quantity, 
          item.notes || '', 
          item.selectedCustomizations || []
        );
      }
    }

    Swal.fire({
      icon: 'success',
      title: '¡Añadido al Carrito!',
      text: 'Tu pedido anterior ha sido añadido. Redirigiendo...',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/cart']);
    });
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
