import { inject, Injectable } from '@angular/core';
import { ConfirmationToken, loadStripe, Stripe, StripeAddressElement, StripeAddressElementOptions, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart.service';
import { Cart } from '../../shared/modules/cart';
import { firstValueFrom, map } from 'rxjs';
import { Address } from '../../shared/modules/user';
import { AccountService } from './account.service';
import { ShippingAddress } from '../../shared/modules/order';

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
  private addressElement?: StripeAddressElement;
  private paymentElement?: StripePaymentElement;

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

  async createPaymentElement() {
    if (!this.paymentElement) {
      const elements = await this.intializeElemeents();
      if (elements) {
        this.paymentElement = elements.create('payment');
      } else {
        throw new Error("Elements instance has not been loaded");
      }
    }
    return this.paymentElement;
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
    return this.addressElement;
  }

  getAddressElement() {
    return this.addressElement;
  }

  async getAddress(): Promise<Address | ShippingAddress | null> {
    const stripeAddressElement = await this.addressElement?.getValue();
    const name = stripeAddressElement?.value.name
    const address = stripeAddressElement?.value.address;
    if (address) {
      return {
        name: name,
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        postalCode: address.postal_code,
        country: address.country
      }
    } else {
      return null;
    }
  }

  getPaymentElement() {
    return this.paymentElement;
  }

  createOrUpdatePaymentIntent () {
    const cart = this.cartService.cart();
    if (!cart) throw new Error("Problem with cart")
    return this.http.post<Cart>(this.baseUrl + 'payments/' + cart.id, {}).pipe(
      map(async cart => {
        await this.cartService.setCart(cart).subscribe();
        return cart;
      })
    );
  }

  async createConfirmationToken() {
    const stripe = await this.getStripeInstance();
    const elements = await this.intializeElemeents();
    const result = await elements.submit();
    if (result.error) {
      throw new Error(result.error.message);
    }
    if (stripe) {
      return await stripe.createConfirmationToken({elements});
    } else {
      throw new Error("Stripe not available");
    }
  }

  async confirmPayment(ConfirmationToken: ConfirmationToken) {
    const stripe = await this.getStripeInstance();
    const elements = await this.intializeElemeents();
    const result = await elements.submit();
    if (result.error) throw new Error(result.error.message);
    const clientSecret = this.cartService.cart()?.clientSecret;
    if (stripe && clientSecret) {
      return await stripe.confirmPayment({
        clientSecret: clientSecret,
        confirmParams: {
          confirmation_token: ConfirmationToken.id
        },
        redirect: 'if_required'
      });
    } else {
      throw new Error("Enable to confirm payment");
    }
  }


  disposeELements() {
    this.elements = undefined;
    this.addressElement = undefined;
    this.paymentElement = undefined;
  }
}
