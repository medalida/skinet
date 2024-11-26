import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AddressPipe } from '../../../shared/pipes/address.pipe';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [DatePipe, AddressPipe, CurrencyPipe, MatProgressSpinner, MatButton, RouterLink, NgIf],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent {

}
