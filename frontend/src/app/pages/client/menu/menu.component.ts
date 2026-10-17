import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 pb-28">
      <!-- Header Area -->
      <header class="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex justify-between items-center">
          <a routerLink="/" class="flex items-center gap-1.5 sm:gap-2 hover:opacity-85 transition-opacity" title="Volver al Inicio">
            <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
            <img src="assets/logo.png" alt="King Dogos GDL" class="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-full border border-amber-400 shadow-sm bg-black" />
            <span class="font-black text-slate-900 tracking-tight text-xs sm:text-base hidden sm:inline">KING<span class="text-amber-500">DOGOS</span></span>
          </a>
          
          <h1 class="text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight text-center">Nuestro Menú</h1>
          
          <div class="flex items-center gap-2">
            <a routerLink="/my-orders" class="text-slate-700 font-bold hover:text-amber-600 transition-colors flex items-center gap-1 text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 py-1.5 px-2.5 sm:px-3 rounded-full" title="Mis Órdenes">
              <svg class="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              <span class="hidden sm:inline">Órdenes</span>
            </a>
            <a routerLink="/cart" class="relative p-2 text-slate-700 hover:text-amber-600 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center" title="Ver Carrito">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <span *ngIf="cartService.items().length > 0" class="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-black/10 shadow-sm">
                {{ cartService.items().length }}
              </span>
            </a>
          </div>
        </div>
        
        <!-- Category Tabs -->
        <div class="overflow-x-auto no-scrollbar py-2 px-3 sm:px-6 border-t border-slate-100">
          <div class="flex gap-2 items-center pr-6 max-w-7xl mx-auto">
            <button 
              (click)="selectCategory('Todos')"
              [class.bg-slate-900]="selectedCategory === 'Todos'"
              [class.text-white]="selectedCategory === 'Todos'"
              [class.border-slate-900]="selectedCategory === 'Todos'"
              [class.bg-white]="selectedCategory !== 'Todos'"
              [class.text-slate-700]="selectedCategory !== 'Todos'"
              [class.border-slate-200]="selectedCategory !== 'Todos'"
              class="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all shrink-0 border shadow-sm">
              Todos
            </button>
            <button 
              *ngFor="let cat of getCategories()"
              (click)="selectCategory(cat)"
              [class.bg-amber-400]="selectedCategory === cat"
              [class.text-black]="selectedCategory === cat"
              [class.border-amber-400]="selectedCategory === cat"
              [class.bg-white]="selectedCategory !== cat"
              [class.text-slate-700]="selectedCategory !== cat"
              [class.border-slate-200]="selectedCategory !== cat"
              class="px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-black whitespace-nowrap transition-all shrink-0 border shadow-sm">
              {{ cat }}
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-8">
        
        <ng-container *ngFor="let category of getCategories()">
          <!-- Only show this category if 'Todos' is selected OR this category is selected -->
          <section *ngIf="selectedCategory === 'Todos' || selectedCategory === category" class="mb-7 sm:mb-12">
            
            <!-- Category Title (only show if 'Todos' is selected to separate sections) -->
            <div *ngIf="selectedCategory === 'Todos'" class="flex items-center gap-2.5 mb-3.5 sm:mb-5">
              <h2 class="text-base sm:text-2xl font-black text-slate-900">{{ category }}</h2>
              <div class="h-px bg-slate-200 flex-1"></div>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <article *ngFor="let dish of groupedDishes[category]" class="bg-white rounded-2xl sm:rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 group flex flex-col">
                <div class="relative h-40 sm:h-52 bg-slate-100 overflow-hidden">
                  <img [src]="dish.imageUrl" [alt]="dish.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" *ngIf="dish.imageUrl" />
                  <div *ngIf="!dish.imageUrl" class="flex items-center justify-center w-full h-full text-slate-400 font-medium bg-slate-50">
                    <svg class="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  </div>
                  <div class="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-sm px-2.5 py-1 rounded-lg font-black text-amber-400 text-xs sm:text-sm shadow-sm border border-amber-400/30">
                    $ {{dish.price}}
                  </div>
                </div>
                <div class="p-3.5 sm:p-5 flex flex-col flex-1">
                  <h3 class="text-sm sm:text-lg font-bold mb-1 text-slate-900 line-clamp-1">{{dish.name}}</h3>
                  <p class="text-slate-500 mb-3 sm:mb-4 flex-1 line-clamp-2 text-xs sm:text-sm leading-relaxed">{{dish.description}}</p>
                  
                  <button (click)="openCustomizer(dish)" class="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-black py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-sm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span>Agregar</span>
                  </button>
                </div>
              </article>
            </div>
          </section>
        </ng-container>

      </main>
      
      <!-- Floating Cart Button -->
      <div class="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none" *ngIf="cartService.items().length > 0">
        <a routerLink="/cart" class="pointer-events-auto flex items-center justify-between gap-4 bg-gradient-to-r from-amber-400 via-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black py-3 sm:py-3.5 px-6 rounded-full transition-transform hover:scale-105 shadow-[0_8px_30px_rgba(245,158,11,0.55)] border-2 border-black/20">
          <div class="flex items-center gap-2">
            <div class="relative">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <span class="absolute -top-2 -right-2.5 bg-black text-amber-400 text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-amber-400/40">
                {{ cartService.items().length }}
              </span>
            </div>
            <span class="text-xs sm:text-sm font-black">Ver Orden</span>
          </div>
          <span class="text-xs sm:text-sm font-black">$ {{ cartService.total() }}</span>
        </a>
      </div>

      <!-- Customization Modal -->
      <div *ngIf="selectedDish" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" (click)="closeCustomizer()"></div>
        
        <!-- Modal Panel (Bottom sheet on mobile, centered modal on desktop) -->
        <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[90vh]">
          
          <div class="relative h-40 sm:h-48 bg-slate-100 shrink-0">
            <img *ngIf="selectedDish.imageUrl" [src]="selectedDish.imageUrl" class="w-full h-full object-cover" />
            <button (click)="closeCustomizer()" class="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full backdrop-blur-sm transition-colors shadow-sm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div class="p-4 sm:p-6 overflow-y-auto no-scrollbar flex-1">
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{{ selectedDish.name }}</h3>
            <p class="text-slate-500 mb-5 text-xs sm:text-sm leading-relaxed">{{ selectedDish.description }}</p>
            
            <!-- Customizations -->
            <div *ngIf="selectedDish.customizations?.length > 0" class="mb-5">
              <h4 class="font-bold text-slate-900 mb-2.5 text-xs sm:text-sm flex items-center gap-1.5 uppercase tracking-wider">
                Personalizar ingredientes
              </h4>
              <div class="space-y-2">
                <label *ngFor="let custom of selectedDish.customizations; let i = index" class="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors text-xs sm:text-sm" [class.bg-amber-50]="selectedCustomizations[i]" [class.border-amber-400]="selectedCustomizations[i]">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" [(ngModel)]="selectedCustomizations[i]" class="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300" />
                    <span class="font-semibold text-slate-800">{{ custom.name }}</span>
                  </div>
                  <span *ngIf="custom.price > 0" class="text-amber-700 font-bold">+$ {{ custom.price }}</span>
                </label>
              </div>
            </div>
            
            <!-- Notes -->
            <div>
              <h4 class="font-bold text-slate-900 mb-2 text-xs sm:text-sm uppercase tracking-wider">
                Notas especiales
              </h4>
              <textarea [(ngModel)]="notes" placeholder="Ej. Sin cebolla, extra mostaza, etc." class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none h-18"></textarea>
            </div>
          </div>
          
          <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 shrink-0">
            <button (click)="confirmAddToCart()" class="w-full flex items-center justify-between bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 sm:py-3.5 px-5 rounded-xl transition-all shadow-md">
              <span class="text-sm sm:text-base">Agregar a Orden</span>
              <span class="text-sm sm:text-base">$ {{ getSelectedDishTotal() }}</span>
            </button>
          </div>
          
        </div>
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
    const desiredOrder = ['Dogos Clásicos', 'Dogos Especiales', 'Snacks & Papas', 'Bebidas', 'Postres', 'Otros'];
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

  selectedDish: any = null;
  selectedCustomizations: boolean[] = [];
  notes: string = '';

  openCustomizer(dish: any) {
    this.selectedDish = dish;
    this.selectedCustomizations = dish.customizations ? new Array(dish.customizations.length).fill(false) : [];
    this.notes = '';
  }

  closeCustomizer() {
    this.selectedDish = null;
  }

  getSelectedDishTotal(): number {
    if (!this.selectedDish) return 0;
    let total = this.selectedDish.price;
    if (this.selectedDish.customizations) {
      this.selectedCustomizations.forEach((isSelected, index) => {
        if (isSelected) {
          total += (this.selectedDish.customizations[index].price || 0);
        }
      });
    }
    return total;
  }

  confirmAddToCart() {
    if (!this.selectedDish) return;
    
    const customizationsToSave: any[] = [];
    if (this.selectedDish.customizations) {
      this.selectedCustomizations.forEach((isSelected, index) => {
        if (isSelected) {
          customizationsToSave.push(this.selectedDish.customizations[index]);
        }
      });
    }
    
    this.cartService.addToCart(this.selectedDish, 1, this.notes, customizationsToSave);
    this.closeCustomizer();
  }
}
