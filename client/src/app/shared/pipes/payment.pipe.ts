import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';

@Pipe({
  name: 'payment',
  standalone: true
})
export class PaymentPipe implements PipeTransform {

  transform(value?: ConfirmationToken['payment_method_preview'], ...args: unknown[]): string {
    if (value?.card) {
      const {brand, last4, exp_year, exp_month, } = value.card;
      return `${brand} **** **** **** ${last4}, Exp: ${exp_month < 10 ? '0' + exp_month : exp_month}/${exp_year.toString().slice(-2)}`;
    }else {
      return '';
    }
  }
}
