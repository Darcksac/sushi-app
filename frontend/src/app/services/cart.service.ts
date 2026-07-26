import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  cartItemId: string; // Unique ID for the cart item instance
  dish: any;
  quantity: number;
  notes: string;
  selectedCustomizations: any[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  
  public items = this.cartItems.asReadonly();
  
  public total = computed(() => {
    return this.cartItems().reduce((sum, item) => {
      let itemTotal = item.dish.price;
      if (item.selectedCustomizations) {
        item.selectedCustomizations.forEach((c: any) => {
          itemTotal += (c.price || 0);
        });
      }
      return sum + (itemTotal * item.quantity);
    }, 0);
  });

  addToCart(dish: any, quantity: number = 1, notes: string = '', selectedCustomizations: any[] = []) {
    this.cartItems.update(items => {
      // Check if exact same customization exists
      const existing = items.find(i => 
        i.dish.id === dish.id && 
        i.notes === notes && 
        JSON.stringify(i.selectedCustomizations) === JSON.stringify(selectedCustomizations)
      );
      
      if (existing) {
        return items.map(i => i.cartItemId === existing.cartItemId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      
      const cartItemId = Math.random().toString(36).substring(2, 9);
      return [...items, { cartItemId, dish, quantity, notes, selectedCustomizations }];
    });
  }

  removeFromCart(cartItemId: string) {
    this.cartItems.update(items => items.filter(i => i.cartItemId !== cartItemId));
  }

  updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }
    this.cartItems.update(items => 
      items.map(i => i.cartItemId === cartItemId ? { ...i, quantity } : i)
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
