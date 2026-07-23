import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
          Tu Carrito
        </h2>

        <div *ngIf="cartService.items().length === 0" class="bg-white p-12 rounded-3xl shadow-sm text-center border border-slate-100">
          <svg class="w-24 h-24 text-slate-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">Tu carrito está vacío</h3>
          <p class="text-slate-500 mb-8">Parece que aún no has agregado nada de nuestro delicioso menú.</p>
          <a routerLink="/menu" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
            Explorar Menú
          </a>
        </div>

        <div *ngIf="cartService.items().length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <div *ngFor="let item of cartService.items()" class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6">
              <img [src]="item.dish.imageUrl" [alt]="item.dish.name" class="w-24 h-24 object-cover rounded-xl" />
              <div class="flex-1">
                <h4 class="text-xl font-bold text-slate-900">{{ item.dish.name }}</h4>
                <div class="text-slate-500 font-medium">$ {{ item.dish.price }}</div>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                  <button (click)="updateQuantity(item.dish.id, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 rounded-md transition-colors">-</button>
                  <span class="w-8 text-center font-bold">{{ item.quantity }}</span>
                  <button (click)="updateQuantity(item.dish.id, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 rounded-md transition-colors">+</button>
                </div>
                <button (click)="removeItem(item.dish.id)" class="text-red-300 hover:text-red-500 transition-colors p-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="bg-slate-900 text-white p-8 rounded-3xl shadow-xl h-fit">
            <h3 class="text-2xl font-bold mb-6">Resumen de Orden</h3>
            <div class="space-y-4 mb-8">
              <div class="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>$ {{ cartService.total() }}</span>
              </div>
              <div *ngIf="discountAmount > 0" class="flex justify-between text-emerald-400 font-medium">
                <span>Descuento (Sushi Gratis)</span>
                <span>- $ {{ discountAmount }}</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div class="border-t border-slate-700 pt-4 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span class="text-red-500">$ {{ finalTotal }}</span>
              </div>
            </div>
            
            <div *ngIf="coupons.length > 0" class="mb-6 bg-slate-800 p-4 rounded-xl border border-dashed border-red-500/50">
              <h4 class="text-red-400 font-bold mb-2 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                Tus Cupones Disponibles
              </h4>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let c of coupons" (click)="couponCodeInput = c.code" class="bg-red-500/20 text-red-300 px-3 py-1 rounded cursor-pointer hover:bg-red-500/30 transition-colors font-mono text-sm border border-red-500/30">
                  {{ c.code }}
                </span>
              </div>
            </div>

            <div class="mb-8">
              <label class="block text-sm font-medium text-slate-300 mb-2">Código de Descuento</label>
              <div class="flex gap-2">
                <input type="text" [(ngModel)]="couponCodeInput" [disabled]="appliedCoupon" placeholder="Ej. FREE-SUSHI-XYZ" class="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-red-500 disabled:opacity-50 uppercase" />
                <button *ngIf="!appliedCoupon" (click)="applyCoupon()" class="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl transition-colors">Aplicar</button>
                <button *ngIf="appliedCoupon" (click)="removeCoupon()" class="bg-red-500/20 text-red-500 hover:bg-red-500/30 font-bold py-3 px-6 rounded-xl transition-colors border border-red-500/30">Quitar</button>
              </div>
            </div>
            
            <div class="mb-8">
              <label class="block text-sm font-medium text-slate-300 mb-2">Hora de Entrega Solicitada</label>
              <input type="time" [(ngModel)]="requestedTime" class="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-red-500" />
            </div>

            <div class="mb-8 border-t border-slate-700 pt-6">
              <label class="block text-sm font-medium text-slate-300 mb-2">Ubicación de Entrega (Requerido)</label>
              <button *ngIf="!latitude" (click)="getLocation()" type="button" class="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors border border-slate-700">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Obtener mi ubicación actual
              </button>
              <div *ngIf="latitude && longitude" class="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span class="text-sm font-medium">Ubicación capturada correctamente.</span>
              </div>
            </div>

            <button *ngIf="authService.isLoggedIn()" (click)="submitOrder()" [disabled]="loading || !latitude" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ loading ? 'Procesando...' : 'Confirmar Orden' }}
            </button>
            <div *ngIf="!authService.isLoggedIn()" class="text-center">
              <p class="text-sm text-slate-400 mb-4">Debes iniciar sesión para ordenar</p>
              <a routerLink="/login" class="block w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-4 rounded-xl transition-colors">
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  apiService = inject(ApiService);
  authService = inject(AuthService);
  router = inject(Router);

  requestedTime = '';
  loading = false;
  latitude: number | null = null;
  longitude: number | null = null;
  
  coupons: any[] = [];
  couponCodeInput = '';
  appliedCoupon: any = null;
  discountAmount = 0;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.fetchCoupons();
    }
  }

  fetchCoupons() {
    const token = this.authService.getToken();
    this.apiService.getMyCoupons(token!).subscribe({
      next: (res) => this.coupons = res,
      error: (err) => console.error('Error fetching coupons', err)
    });
  }

  applyCoupon() {
    if (!this.couponCodeInput) return;
    const coupon = this.coupons.find(c => c.code === this.couponCodeInput);
    if (!coupon) {
      Swal.fire({ icon: 'error', title: 'Cupón Inválido', text: 'El código ingresado no existe o ya fue usado.', confirmButtonColor: '#ef4444' });
      return;
    }
    
    // Calculate max sushi price
    let maxSushiPrice = 0;
    for (const item of this.cartService.items()) {
      if (item.dish.category === 'Sushis' && item.dish.price > maxSushiPrice) {
        maxSushiPrice = item.dish.price;
      }
    }
    
    if (maxSushiPrice === 0) {
      Swal.fire({ icon: 'warning', title: 'Atención', text: 'Necesitas tener al menos un platillo de categoría Sushis en tu carrito para usar este cupón.', confirmButtonColor: '#ef4444' });
      return;
    }
    
    this.appliedCoupon = coupon;
    this.discountAmount = maxSushiPrice;
    Swal.fire({ icon: 'success', title: 'Cupón Aplicado', text: 'Se ha descontado el sushi más caro de tu orden.', confirmButtonColor: '#10b981' });
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.discountAmount = 0;
    this.couponCodeInput = '';
  }

  get finalTotal() {
    const total = this.cartService.total() - this.discountAmount;
    return total < 0 ? 0 : total;
  }

  updateQuantity(dishId: number, quantity: number) {
    this.cartService.updateQuantity(dishId, quantity);
  }

  removeItem(dishId: number) {
    this.cartService.removeFromCart(dishId);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        (error) => {
          Swal.fire({
            icon: 'warning',
            title: 'Ubicación requerida',
            text: 'No pudimos obtener tu ubicación. Por favor, permite el acceso al GPS en tu navegador.',
            confirmButtonColor: '#ef4444'
          });
          console.error(error);
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Tu navegador no soporta geolocalización.',
        confirmButtonColor: '#ef4444'
      });
    }
  }

  submitOrder() {
    if (!this.latitude || !this.longitude) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta ubicación',
        text: 'Por favor comparte tu ubicación antes de confirmar la orden.',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    this.loading = true;
    const token = this.authService.getToken();
    const items = this.cartService.items().map(i => ({ dishId: i.dish.id, quantity: i.quantity }));
    
    // Create requestedDeliveryTime Date object for today at the requested time
    let requestedDeliveryTime = null;
    if (this.requestedTime) {
      const [hours, minutes] = this.requestedTime.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      requestedDeliveryTime = date.toISOString();
    }

    this.apiService.createOrder({ 
      items, 
      requestedDeliveryTime,
      latitude: this.latitude,
      longitude: this.longitude,
      couponCode: this.appliedCoupon?.code
    }, token!).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.loading = false;
        
        Swal.fire({
          icon: 'success',
          title: '¡Orden Exitosa!',
          text: '¡Tu orden ha sido enviada al administrador y pronto será preparada!',
          confirmButtonColor: '#10b981',
          timer: 3000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/']);
        });
      },
      error: (err) => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al ordenar',
          text: err.error?.message || 'Ha ocurrido un error al procesar tu orden.',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}
