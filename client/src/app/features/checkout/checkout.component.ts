import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepper, MatStepperModule} from '@angular/material/stepper'; 
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatButtonModule } from '@angular/material/button';
import { StripeService } from '../../core/services/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Address } from '../../shared/modules/user';
import { AccountService } from '../../core/services/account.service';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { firstValueFrom } from 'rxjs';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { ConfirmationToken, StripeAddressElementChangeEvent, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [MatCheckboxModule, 
    MatButtonModule, 
    MatStepperModule, 
    OrderSummaryComponent, 
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    MatProgressSpinnerModule,
    CurrencyPipe,
    MatStepper],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {

  private stripeService = inject(StripeService);
  private accountSercie = inject(AccountService);
  cartSercie = inject(CartService);
  private snack = inject(SnackbarService);
  private router = inject(Router);
  saveAddress: boolean = false;
  completionStatus = signal<{address: boolean, card: boolean, delivery: boolean}>(
    {address: false, card: false, delivery: false}
  );
  confirmationToken? : ConfirmationToken;
  loading = false;

  async ngOnInit() {
    try {
      (await this.stripeService.createAddressElement()).mount('#stripe-address-element');
      (await this.stripeService.createPaymentElement()).mount('#stripe-payment-element');
      this.stripeService.getAddressElement()?.on('change', this.handleAddressChange);
      this.stripeService.getPaymentElement()?.on('change', this.handlePaymentChange);
    } catch (error: any) {
      this.snack.error(error.message);
    }
  }

  OnSaveAddressCheckboxChange(event: MatCheckboxChange) {
    this.saveAddress = event.checked;
  }

  async OnStepperSelectionChange(event: StepperSelectionEvent) {
    if (event.selectedIndex === 1) {
      if (this.saveAddress) {
        const address = await this.getAddressFromStripe();
        if (address) {
          this.accountSercie.updateAddress(address).subscribe();
        }
      }
    } else if (event.selectedIndex === 2) {
      await firstValueFrom(this.stripeService.createOrUpdatePaymentIntent());
    } else if (event.selectedIndex === 3 ) {
      await this.getConfirmationToken();
    }
  }

  async getAddressFromStripe(): Promise<Address | null> {
    const address = (await this.stripeService.getAddressElement()?.getValue())?.value.address;
    if (address) {
      return {
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
  
  ngOnDestroy(): void {
    this.stripeService.disposeELements();
  }
  
  handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.address = event.complete;
      return state;
    });
  }

  handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
    this.completionStatus.update(state => {
      state.card = event.complete;
      return state;
    });
  }

  handleDeliveryChange = (event: boolean) => {
    this.completionStatus.update(state => {
      state.delivery = event;
      return state;
    });
  }

  async getConfirmationToken() {
    try {
      if (Object.values(this.completionStatus).every(status => status)) {
        const result = await this.stripeService.createConfirmationToken();
        if (result.error) throw new Error(result.error.message);
        this.confirmationToken = result.confirmationToken;
        console.log(this.confirmationToken);
      }
    } catch (error: any) {
      this.snack.error(error.message);
    }
  }

  async confirmPayment(stepper: MatStepper) {
    this.loading = true;
    try {
      if (this.confirmationToken) {
        const result = await this.stripeService.confirmPayment(this.confirmationToken);
        if (result.error) {
          throw result.error;
        }
        this.cartSercie.deleteCart();
        this.router.navigateByUrl('/checkout/success');
      }
    } catch (error: any) {
      this.snack.error(error.message || "something went wrong");
      stepper.previous();
    } finally {
      this.loading = false;
    }
  }

}

