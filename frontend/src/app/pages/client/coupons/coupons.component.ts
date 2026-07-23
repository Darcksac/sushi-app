import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 py-12 px-6">
      <div class="max-w-4xl mx-auto mb-6">
        <a routerLink="/" class="text-red-500 font-bold hover:text-red-600 flex items-center gap-2 transition-colors w-fit">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al Inicio
        </a>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-extrabold text-slate-900 mb-8 flex items-center gap-4">
          Mis Cupones
        </h2>

        <div *ngIf="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p class="mt-4 text-slate-500">Cargando tus recompensas...</p>
        </div>

        <div *ngIf="!loading && coupons.length === 0" class="bg-white p-12 rounded-3xl shadow-sm text-center border border-slate-100">
          <svg class="w-24 h-24 text-slate-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          <h3 class="text-2xl font-bold text-slate-900 mb-2">Aún no tienes cupones</h3>
          <p class="text-slate-500 mb-8">Completa pedidos para ir ganando cupones de descuento. ¡Al 3er, 5to y 10mo pedido obtendrás recompensas!</p>
          <a routerLink="/menu" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
            Explorar Menú
          </a>
        </div>

        <div *ngIf="!loading && coupons.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let coupon of coupons" 
               class="relative rounded-2xl shadow-sm border p-6 overflow-hidden transition-all"
               [ngClass]="{
                 'bg-white border-red-200 hover:shadow-md': !coupon.isUsed && !isExpired(coupon.expiresAt),
                 'bg-slate-100 border-slate-200 opacity-75': coupon.isUsed || isExpired(coupon.expiresAt)
               }">
            
            <!-- Red accent line for valid coupons -->
            <div *ngIf="!coupon.isUsed && !isExpired(coupon.expiresAt)" class="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

            <div class="flex justify-between items-start mb-4 mt-2">
              <span class="text-3xl font-extrabold" [ngClass]="coupon.isUsed || isExpired(coupon.expiresAt) ? 'text-slate-400' : 'text-red-500'">
                {{ coupon.discountPercentage }}% OFF
              </span>
              
              <span *ngIf="coupon.isUsed" class="px-2 py-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">USADO</span>
              <span *ngIf="!coupon.isUsed && isExpired(coupon.expiresAt)" class="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">EXPIRADO</span>
              <span *ngIf="!coupon.isUsed && !isExpired(coupon.expiresAt)" class="px-2 py-1 bg-emerald-100 text-emerald-600 text-xs font-bold rounded-full">ACTIVO</span>
            </div>

            <div class="mb-4">
              <p class="text-sm text-slate-500 mb-1">Código:</p>
              <div class="font-mono bg-slate-50 p-2 rounded border border-slate-200 text-center tracking-widest text-lg font-bold"
                   [ngClass]="coupon.isUsed || isExpired(coupon.expiresAt) ? 'text-slate-400' : 'text-slate-800'">
                {{ coupon.code }}
              </div>
            </div>

            <div class="text-sm font-medium flex items-center gap-2" [ngClass]="isExpired(coupon.expiresAt) ? 'text-slate-400' : 'text-orange-500'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Vence: {{ coupon.expiresAt | date:'dd/MM/yyyy, h:mm a' }}
            </div>
            
            <!-- Perforated edges effect -->
            <div class="absolute -left-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-200" [ngClass]="{'border-red-200': !coupon.isUsed && !isExpired(coupon.expiresAt)}"></div>
            <div class="absolute -right-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-200" [ngClass]="{'border-red-200': !coupon.isUsed && !isExpired(coupon.expiresAt)}"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CouponsComponent implements OnInit {
  apiService = inject(ApiService);
  authService = inject(AuthService);
  
  coupons: any[] = [];
  loading = true;

  ngOnInit() {
    this.fetchCoupons();
  }

  fetchCoupons() {
    const token = this.authService.getToken();
    if (!token) {
      this.loading = false;
      return;
    }
    this.apiService.getMyCoupons(token).subscribe({
      next: (res: any) => {
        this.coupons = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching coupons', err);
        this.loading = false;
      }
    });
  }

  isExpired(dateString: string): boolean {
    return new Date() > new Date(dateString);
  }
}
