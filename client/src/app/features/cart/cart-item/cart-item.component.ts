import { Component, inject, input } from '@angular/core';
import { CartItem } from '../../../shared/modules/cart';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [RouterLink, MatIconModule, CurrencyPipe, MatButtonModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartService = inject(CartService);
  
  incrementQuantity(): void {
    this.cartService.addItemToCart(this.item());
  }

  decrementQuantity(): void {
    this.cartService.removeItemFromCart(this.item().productId);
  }

  removeItemFromCart(): void {
    this.cartService.removeItemFromCart(this.item().productId, this.item().quantity);
  }
}


