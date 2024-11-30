import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SignalrService } from '../../../core/services/signalr.service';
import { PaymentPipe } from '../../../shared/pipes/payment.pipe';
import { OrderService } from '../../../core/services/order.service';
import { CheckoutService } from '../../../core/services/checkout.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, MatProgressSpinner, MatButton, RouterLink, NgIf, PaymentPipe, AddressPipe],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnDestroy {
  signalrService = inject(SignalrService);
  private checkoutService = inject(CheckoutService);

  ngOnDestroy(): void {
    this.checkoutService.checkoutComplete = false;
    this.signalrService.orderSignal.set(null);
  }
}
