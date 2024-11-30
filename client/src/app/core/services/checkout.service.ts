import { inject, Injectable } from '@angular/core';
import { DeliveryMethod } from '../../shared/modules/deliveryMethod';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom, map, of } from 'rxjs';
import { ConfirmationToken } from '@stripe/stripe-js';
import { StripeService } from './stripe.service';
import { CartService } from './cart.service';
import { OrderToCrete, ShippingAddress } from '../../shared/modules/order';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private stripeService = inject(StripeService);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  deliveryMethods: DeliveryMethod[] = [];
  confirmationToken? : ConfirmationToken;
  checkoutComplete = false;
  

  getDelivryMethods() {
    if (this.deliveryMethods.length > 0) return of(this.deliveryMethods);
    return this.http.get<DeliveryMethod[]>(`${this.baseUrl}payments/delivery-methods`).pipe(
      map((dm: DeliveryMethod[]) => {
        return this.deliveryMethods = dm.sort((a, b) => b.price - a.price);
      })
    );
  }

  async confirmPayment() {
    if (this.confirmationToken) {
      const result = await this.stripeService.confirmPayment(this.confirmationToken);

      if (result.paymentIntent?.status === 'succeeded') {
        const orderToCreate = await this.createOrderModel();
        if (!orderToCreate) {
          throw new Error("Problem while creating order");
        }
        const orderResult = await firstValueFrom(this.orderService.createOrder(orderToCreate));
        if (!orderResult) {
          throw new Error("Order creation failed");
        }
        this.checkoutComplete = true;
        this.cartService.deleteCart();
        this.cartService.selectedDelivery.set(null);
      } else if (result.error) {
        throw result.error;
      } else {
        throw new Error("Something went wrong");
      }
    }
  }

  private async createOrderModel(): Promise<OrderToCrete> {
    const cart = this.cartService.cart();
    const shippingAddress = await this.stripeService.getAddress() as ShippingAddress;
    const card = this.confirmationToken?.payment_method_preview.card;
    if (!card || !shippingAddress || !cart) {
      console.log("this is : " + shippingAddress);
      throw new Error("Problem while creating order");
    }
    return {
      cartId: cart.id,
      deliveryMethodId: cart.deliveryMethodId,
      shippingAddress: shippingAddress,
      paymentSummary: {
        last4: +card.last4,
        brand: card.brand,
        expMonth: card.exp_month,
        expYear: card.exp_year
      },
    }
  }
  
}
