import { Component, inject, OnInit, output } from '@angular/core';
import { CheckoutService } from '../../../core/services/checkout.service';
import { MatRadioModule } from '@angular/material/radio';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { DeliveryMethod } from '../../../shared/modules/deliveryMethod';

@Component({
  selector: 'app-checkout-delivery',
  standalone: true,
  imports: [MatRadioModule, CurrencyPipe],
  templateUrl: './checkout-delivery.component.html',
  styleUrl: './checkout-delivery.component.scss'
})
export class CheckoutDeliveryComponent implements OnInit {
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  deliveryComplete = output<boolean>();

  ngOnInit(): void {
    this.checkoutService.getDelivryMethods().subscribe({
      next: (methods) => {
        if (this.cartService.cart()?.deliveryMethodId) {
          this.cartService.selectedDelivery.set(methods.find(m => m.id === this.cartService.cart()?.deliveryMethodId) ?? null);
          this.deliveryComplete.emit(true);
        }
      },
      error: (error) => console.error(error)
    });
  }

  updateDeliveryMethod(method: DeliveryMethod): void {
    this.cartService.selectedDelivery.set(method);
    let cart = this.cartService.cart();
    if (cart) {
      cart.deliveryMethodId = method.id;
      this.cartService.setCart(cart);
      this.deliveryComplete.emit(true);
    }
  }
}
