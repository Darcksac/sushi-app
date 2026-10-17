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
    <div class="min-h-screen bg-slate-950 py-6 sm:py-12 px-3.5 sm:px-6 text-slate-100">
      <div class="max-w-4xl mx-auto mb-4 sm:mb-8 flex items-center justify-between">
        <a routerLink="/" class="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1.5 sm:gap-2 transition-colors text-xs sm:text-base w-fit">
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al Inicio
        </a>
        <div class="flex items-center gap-2 sm:gap-3">
          <img src="assets/logo.png" alt="King Dogos GDL" class="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full border border-amber-500/40 shadow-lg shadow-amber-500/20" />
          <span class="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">King Dogos GDL</span>
        </div>
      </div>
      
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
          <svg class="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            Mis Cupones King
          </h2>
        </div>

        <div *ngIf="loading" class="text-center py-12 sm:py-16">
          <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-400 mx-auto"></div>
          <p class="mt-4 text-slate-400 text-sm sm:text-base">Cargando tus recompensas reales...</p>
        </div>

        <div *ngIf="!loading && coupons.length === 0" class="bg-slate-900/80 backdrop-blur p-6 sm:p-12 rounded-3xl shadow-xl text-center border border-amber-500/20">
          <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <svg class="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          </div>
          <h3 class="text-xl sm:text-2xl font-black text-white mb-2">Aún no tienes cupones</h3>
          <p class="text-slate-400 mb-6 sm:mb-8 text-xs sm:text-sm max-w-md mx-auto">Completa pedidos para ir ganando cupones de descuento exclusivos King Dogos. ¡Al 3er, 5to y 10mo pedido obtendrás recompensas!</p>
          <a routerLink="/menu" class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-7 rounded-full transition-all shadow-lg shadow-amber-400/20 inline-block text-sm sm:text-base">
            Explorar Menú de Dogos
          </a>
        </div>

        <div *ngIf="!loading && coupons.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div *ngFor="let coupon of coupons" 
               class="relative rounded-2xl shadow-lg border p-6 overflow-hidden transition-all"
               [ngClass]="{
                 'bg-slate-900 border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/10': !coupon.isUsed && !isExpired(coupon.expiresAt),
                 'bg-slate-900/40 border-slate-800 opacity-60': coupon.isUsed || isExpired(coupon.expiresAt)
               }">
            
            <!-- Amber gold accent line for valid coupons -->
            <div *ngIf="!coupon.isUsed && !isExpired(coupon.expiresAt)" class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300"></div>

            <div class="flex justify-between items-start mb-4 mt-2">
              <span class="text-3xl font-black" [ngClass]="coupon.isUsed || isExpired(coupon.expiresAt) ? 'text-slate-500' : 'text-amber-400'">
                {{ coupon.discountPercentage }}% OFF
              </span>
              
              <span *ngIf="coupon.isUsed" class="px-2.5 py-1 bg-slate-800 text-slate-400 text-xs font-bold rounded-full border border-slate-700">USADO</span>
              <span *ngIf="!coupon.isUsed && isExpired(coupon.expiresAt)" class="px-2.5 py-1 bg-red-950/60 text-red-400 text-xs font-bold rounded-full border border-red-800/40">EXPIRADO</span>
              <span *ngIf="!coupon.isUsed && !isExpired(coupon.expiresAt)" class="px-2.5 py-1 bg-amber-400/10 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">ACTIVO</span>
            </div>

            <div class="mb-4">
              <p class="text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">Código King:</p>
              <div class="font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center tracking-widest text-lg font-black"
                   [ngClass]="coupon.isUsed || isExpired(coupon.expiresAt) ? 'text-slate-600' : 'text-amber-400 border-amber-500/30'">
                {{ coupon.code }}
              </div>
            </div>

            <div class="text-xs font-medium flex items-center gap-2" [ngClass]="isExpired(coupon.expiresAt) ? 'text-slate-500' : 'text-amber-300'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Vence: {{ coupon.expiresAt | date:'dd/MM/yyyy, h:mm a' }}
            </div>
            
            <!-- Perforated edges effect -->
            <div class="absolute -left-3 top-1/2 w-6 h-6 bg-slate-950 rounded-full border-r border-slate-800" [ngClass]="{'border-amber-500/30': !coupon.isUsed && !isExpired(coupon.expiresAt)}"></div>
            <div class="absolute -right-3 top-1/2 w-6 h-6 bg-slate-950 rounded-full border-l border-slate-800" [ngClass]="{'border-amber-500/30': !coupon.isUsed && !isExpired(coupon.expiresAt)}"></div>
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
