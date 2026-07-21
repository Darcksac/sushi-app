import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  dish: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  public items = this.cartItems.asReadonly();
  
  public total = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.dish.price * item.quantity), 0);
  });

  addToCart(dish: any) {
    this.cartItems.update(items => {
      const existing = items.find(i => i.dish.id === dish.id);
      if (existing) {
        return items.map(i => i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { dish, quantity: 1 }];
    });
  }

  removeFromCart(dishId: number) {
    this.cartItems.update(items => items.filter(i => i.dish.id !== dishId));
  }

  updateQuantity(dishId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(dishId);
      return;
    }
    this.cartItems.update(items => 
      items.map(i => i.dish.id === dishId ? { ...i, quantity } : i)
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
