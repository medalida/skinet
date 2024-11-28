import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { PaymentSummary } from '../modules/order';

@Pipe({
  name: 'payment',
  standalone: true
})
export class PaymentPipe implements PipeTransform {

  transform(value?: ConfirmationToken['payment_method_preview'] | PaymentSummary, ...args: unknown[]): string {
    if (value && 'card' in value) {
      const {brand, last4, exp_year, exp_month, } = (value as ConfirmationToken['payment_method_preview']).card!;
      return `${brand} **** **** **** ${last4}, Exp: ${exp_month < 10 ? '0' + exp_month : exp_month}/${exp_year.toString().slice(-2)}`;
    } else if (value) {
      const {brand, last4, expYear, expMonth, } = value as PaymentSummary;
      return `${brand} **** **** **** ${last4}, Exp: ${expMonth < 10 ? '0' + expMonth : expMonth}/${expYear.toString().slice(-2)}`;
    } else {
      return '';
    }
  }
}
