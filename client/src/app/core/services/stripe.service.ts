import { inject, Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '../../shared/modules/cart';
import { firstValueFrom, map } from 'rxjs';
import { Address } from '../../shared/modules/user';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = environment.baseUrl;
  private cartService = inject(CartService);
  private accountSercie = inject(AccountService);
  private http = inject(HttpClient);
  private stripePromise?: Promise<Stripe | null>;
  private elements?: StripeElements;
  addressElement?: StripeAddressElement;

  constructor() { 
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  getStripeInstance() {
    return this.stripePromise;
  }

  async intializeElemeents() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent())
        this.elements = stripe.elements({clientSecret: cart.clientSecret, appearance: {labels: 'floating'}});
      } else {
        throw new Error("Stripe has not been loaded");
      }
    }
    return this.elements;
  }

  async createAddressElement() {
    if (!this.addressElement) {
      const elements = await this.intializeElemeents();
      if (elements) {
        const user = this.accountSercie.currentUser();
        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};
        if (user) {
          defaultValues.name = user.firstName + ' ' + user.lastName;
          if (user.address) {
            defaultValues.address = {
              line1: user.address.line1,
              line2: user.address.line2,
              city: user.address.city,
              state: user.address.state,
              postal_code: user.address.postalCode,
              country: user.address.country
            }
          }
        }
        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues: defaultValues,
        }
        this.addressElement = elements.create('address', options);
      } else {
        throw new Error("Elements instance has not been loaded");
      }
    }
  }

  createOrUpdatePaymentIntent () {
    const cart = this.cartService.cart();
    if (!cart) throw new Error("Problem with cart")
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      map(cart => {
        this.cartService.setCart(cart);
        return cart;
      })
    );
  }

  disposeELements() {
    this.elements = undefined;
    this.addressElement = undefined;
  }
}