import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper'; 
import { OrderSummaryComponent } from '../../shared/components/order-summary/order-summary.component';
import { MatButtonModule } from '@angular/material/button';
import { StripeService } from '../../core/services/stripe.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Address } from '../../shared/modules/user';
import { AccountService } from '../../core/services/account.service';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, MatStepperModule, OrderSummaryComponent, CheckoutDeliveryComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {

  private stripeSercie = inject(StripeService);
  private accountSercie = inject(AccountService);
  private snack = inject(SnackbarService);
saveAddress: boolean = false;

  async ngOnInit() {
    try {
      await this.stripeSercie.createAddressElement();
      this.stripeSercie.addressElement?.mount('#address-element');
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
      await firstValueFrom(this.stripeSercie.createOrUpdatePaymentIntent());
    }
  }

  async getAddressFromStripe(): Promise<Address | null> {
    const address = (await this.stripeSercie.addressElement?.getValue())?.value.address;
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
    this.stripeSercie.disposeELements();
  }
}
