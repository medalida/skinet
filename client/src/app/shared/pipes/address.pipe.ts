import { Pipe, PipeTransform } from '@angular/core';
import { ConfirmationToken } from '@stripe/stripe-js';
import { ShippingAddress } from '../modules/order';

@Pipe({
  name: 'address',
  standalone: true
})
export class AddressPipe implements PipeTransform {

  transform(value?: ConfirmationToken['shipping'] | ShippingAddress): string {
    if (value && 'address' in value && value.name) {
      const {line1, line2, city, postal_code, country, state} = (value as ConfirmationToken['shipping'])?.address!;
      return `${value.name} ${line1} ${line2 ? ', ' + line2: ''} ${city} ${state} ${postal_code} ${country}`;
    } else if (value) {
      const {line1, line2, city, postalCode, country, state} = value as ShippingAddress;
      return `${value.name} ${line1} ${line2 ? ', ' + line2: ''} ${city} ${state} ${postalCode} ${country}`;
    }
    else {
      return 'Unknown address';
    }
  } 

}
