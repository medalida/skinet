import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/modules/cart';
import { Product } from '../../shared/modules/product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.baseUrl;
  private http: HttpClient = inject(HttpClient);
  cart = signal<Cart | null>(null);
  itemCount = computed(() => this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0);
  totals = computed(() => {
    const cart = this.cart();
    if (!cart) {
      return null;
    }
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discout = 0;
    const shipping = 0;
    return {
      subtotal,
      discout,
      shipping,
      total: subtotal - discout + shipping
    }
  });
  
  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    );
  }

  setCart(cart: Cart): void {
    this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: (response) => {
        this.cart.set(response);
      },
      error: (error) => console.error(error)
    });
  }

  addItemToCart(item: CartItem | Product, quantity = 1): void {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdate(cart.items, item, quantity);
    this.setCart(cart);
  }

  addOrUpdate(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(i => i.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }


  mapProductToCartItem(item: Product): CartItem {
    return {
    productId: item.id,
    productName: item.name,
    quantity: 0,
    price: item.price,
    pictureUrl: item.pictureUrl,
    type: item.type,
    brand: item.brand
    }
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  removeItemFromCart(productId: number, quantity: number = 1): void {
    const cart = this.cart();
    if (!cart) {
      return;
    }
    const index = cart.items.findIndex(item => item.productId === productId);
    if (index === -1) {
      return;
    }
    if (cart.items[index].quantity > quantity) {
      cart.items[index].quantity -= quantity;
    } else {
      cart.items.splice(index, 1);
    }
    if (cart.items.length === 0) {
      this.deleteCart(cart.id);
    } else {
      this.setCart(cart);
    }
  }

  deleteCart(id: string) {
    this.http.delete(this.baseUrl + 'cart?id=' + id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        this.cart.set(null);
      },
      error: (error) => console.error(error)
    });
  }
}