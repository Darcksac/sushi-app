import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 pb-24">
      <!-- Header Area -->
      <div class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a routerLink="/" class="text-red-500 font-bold hover:text-red-600 flex items-center gap-2 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            <span class="hidden sm:inline">Inicio</span>
          </a>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Nuestro Menú</h1>
          <a routerLink="/my-orders" class="text-slate-600 font-bold hover:text-slate-900 transition-colors flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span class="hidden sm:inline">Órdenes</span>
          </a>
        </div>
        
        <!-- Category Tabs -->
        <div class="border-t border-slate-100 overflow-x-auto custom-scrollbar">
          <div class="max-w-7xl mx-auto px-6 py-3 flex gap-3">
            <button 
              (click)="selectCategory('Todos')"
              [class.bg-slate-900]="selectedCategory === 'Todos'"
              [class.text-white]="selectedCategory === 'Todos'"
              [class.bg-slate-100]="selectedCategory !== 'Todos'"
              [class.text-slate-600]="selectedCategory !== 'Todos'"
              class="px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all hover:bg-slate-800 hover:text-white">
              Todos
            </button>
            <button 
              *ngFor="let cat of getCategories()"
              (click)="selectCategory(cat)"
              [class.bg-red-500]="selectedCategory === cat"
              [class.text-white]="selectedCategory === cat"
              [class.bg-slate-100]="selectedCategory !== cat"
              [class.text-slate-600]="selectedCategory !== cat"
              class="px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all hover:bg-red-500 hover:text-white">
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 pt-12">
        
        <ng-container *ngFor="let category of getCategories()">
          <!-- Only show this category if 'Todos' is selected OR this category is selected -->
          <div *ngIf="selectedCategory === 'Todos' || selectedCategory === category" class="mb-16 fade-in">
            
            <!-- Category Title (only show if 'Todos' is selected to separate sections) -->
            <div *ngIf="selectedCategory === 'Todos'" class="flex items-center gap-4 mb-8">
              <h3 class="text-3xl font-bold text-slate-900">{{ category }}</h3>
              <div class="h-px bg-slate-200 flex-1"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div *ngFor="let dish of groupedDishes[category]" class="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1 border border-slate-100/50 group flex flex-col">
                <div class="relative h-56 bg-slate-100 overflow-hidden">
                  <img [src]="dish.imageUrl" [alt]="dish.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" *ngIf="dish.imageUrl" />
                  <div *ngIf="!dish.imageUrl" class="flex items-center justify-center w-full h-full text-slate-400 font-medium bg-slate-50">
                    <svg class="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  </div>
                  <div class="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-2xl font-black text-slate-900 shadow-sm">
                    $ {{dish.price}}
                  </div>
                </div>
                <div class="p-6 flex flex-col flex-1">
                  <h4 class="text-2xl font-bold mb-2 text-slate-900 line-clamp-1">{{dish.name}}</h4>
                  <p class="text-slate-500 mb-6 flex-1 line-clamp-2 text-sm leading-relaxed">{{dish.description}}</p>
                  
                  <button (click)="addToCart(dish)" class="w-full flex items-center justify-center gap-2 bg-slate-50 hover:bg-red-500 text-slate-700 hover:text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 mt-auto group/btn">
                    <svg class="w-5 h-5 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ng-container>

      </div>
      
      <!-- Floating Cart Button -->
      <div class="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none" *ngIf="cartService.items().length > 0">
        <a routerLink="/cart" class="pointer-events-auto flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(239,68,68,0.4)] border-4 border-white/50 backdrop-blur-md">
          <div class="relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span class="absolute -top-2 -right-3 bg-white text-red-500 text-xs font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              {{ cartService.items().length }}
            </span>
          </div>
          <span>Ver Orden ($ {{ cartService.total() }})</span>
        </a>
      </div>

    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      height: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #e2e8f0;
      border-radius: 4px;
    }
    .fade-in {
      animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MenuComponent implements OnInit {
  apiService = inject(ApiService);
  cartService = inject(CartService);
  
  groupedDishes: { [key: string]: any[] } = {};
  selectedCategory: string = 'Todos';

  ngOnInit() {
    this.apiService.getDishes().subscribe({
      next: (data: any[]) => {
        // Group dishes by category
        this.groupedDishes = data.reduce((acc, dish) => {
          const category = dish.category || 'Otros';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(dish);
          return acc;
        }, {} as { [key: string]: any[] });
      },
      error: (err) => console.error(err)
    });
  }

  getCategories(): string[] {
    const desiredOrder = ['Sushis', 'Platillos', 'Bebidas', 'Postres', 'Otros'];
    return Object.keys(this.groupedDishes).sort((a, b) => {
      let indexA = desiredOrder.indexOf(a);
      let indexB = desiredOrder.indexOf(b);
      if (indexA === -1) indexA = 99;
      if (indexB === -1) indexB = 99;
      return indexA - indexB;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(dish: any) {
    this.cartService.addToCart(dish);
  }
}
